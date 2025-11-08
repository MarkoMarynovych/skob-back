import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { v4 as uuidv4 } from "uuid"
import { InviteSchema } from "~shared/infrastructure/database/postgres/schemas/invite.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { KurinSchema } from "~shared/infrastructure/database/postgres/schemas/kurin.schema"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { InviteType } from "../../../domain/enums/invite-type.enum"
import { Role } from "~modules/users/application/enums/role.enum"

interface GenerateInviteInput {
  userId: string
  type: InviteType
  contextId: string
}

export interface GenerateInviteOutput {
  token: string
  inviteLink: string
  expiresAt: Date
}

@Injectable()
export class GenerateInviteUseCase implements IUseCase<GenerateInviteInput, GenerateInviteOutput> {
  constructor(
    @InjectRepository(InviteSchema)
    private readonly inviteRepository: Repository<InviteSchema>,
    @InjectRepository(UserSchema)
    private readonly userSchemaRepository: Repository<UserSchema>,
    @InjectRepository(KurinSchema)
    private readonly kurinRepository: Repository<KurinSchema>,
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: GenerateInviteInput): Promise<GenerateInviteOutput> {
    const user = await this.userSchemaRepository.findOne({
      where: { id: input.userId },
      relations: ["role", "kurin"],
    })

    if (!user) {
      throw new NotFoundException(`User not found`)
    }

    await this.validatePermissions(user, input.type, input.contextId)

    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invite = this.inviteRepository.create({
      token,
      type: input.type,
      contextId: input.contextId,
      expiresAt,
      createdBy: user,
    })

    await this.inviteRepository.save(invite)

    const frontendUrl = process.env.FRONTEND_BASE_URL || "http://localhost:5173"
    const inviteLink = `${frontendUrl}/join/${token}`

    return {
      token,
      inviteLink,
      expiresAt,
    }
  }

  private async validatePermissions(user: UserSchema, type: InviteType, contextId: string): Promise<void> {
    const userRole = user.role.name as Role

    switch (type) {
      case InviteType.LIAISON:
        if (userRole !== Role.ADMIN) {
          throw new ForbiddenException("Only ADMIN can create LIAISON invites")
        }
        const kurin = await this.kurinRepository.findOne({ where: { id: contextId } })
        if (!kurin) {
          throw new NotFoundException(`Kurin with ID ${contextId} not found`)
        }
        break

      case InviteType.FOREMAN:
        if (userRole !== Role.LIAISON) {
          throw new ForbiddenException("Only LIAISON can create FOREMAN invites")
        }
        const foremanKurin = await this.kurinRepository.findOne({ where: { id: contextId } })
        if (!foremanKurin) {
          throw new NotFoundException(`Kurin with ID ${contextId} not found`)
        }
        if (!user.kurin || user.kurin.id !== contextId) {
          throw new ForbiddenException("You can only invite FOREMAN to your own Kurin")
        }
        break

      case InviteType.SCOUT:
      case InviteType.CO_FOREMAN:
        if (userRole !== Role.FOREMAN) {
          throw new ForbiddenException("Only FOREMAN can create SCOUT or CO_FOREMAN invites")
        }
        const group = await this.groupRepository.findById(contextId)
        if (!group) {
          throw new NotFoundException(`Group with ID ${contextId} not found`)
        }
        const isOwner = group.owner.id === user.id
        const isMember = await this.groupRepository.isMember(contextId, user.id)
        if (!isOwner && !isMember) {
          throw new ForbiddenException("You can only create invites for groups you own or are a member of")
        }
        break

      default:
        throw new BadRequestException(`Invalid invite type: ${type}`)
    }
  }
}
