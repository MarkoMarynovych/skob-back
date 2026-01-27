import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { InviteSchema } from "~shared/infrastructure/database/postgres/schemas/invite.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"
import { KurinSchema } from "~shared/infrastructure/database/postgres/schemas/kurin.schema"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { InviteType } from "../../../domain/enums/invite-type.enum"
import { Role } from "~modules/users/application/enums/role.enum"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"

interface AcceptInviteInput {
  token: string
  userId: string
}

export interface AcceptInviteOutput {
  message: string
  roleAssigned?: Role
  kurinId?: string
  kurinName?: string
  groupId?: string
  groupName?: string
}

@Injectable()
export class AcceptInviteV2UseCase implements IUseCase<AcceptInviteInput, AcceptInviteOutput> {
  constructor(
    @InjectRepository(InviteSchema)
    private readonly inviteRepository: Repository<InviteSchema>,
    @InjectRepository(UserSchema)
    private readonly userSchemaRepository: Repository<UserSchema>,
    @InjectRepository(RoleSchema)
    private readonly roleRepository: Repository<RoleSchema>,
    @InjectRepository(KurinSchema)
    private readonly kurinRepository: Repository<KurinSchema>,
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(UserDiToken.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository
  ) {}

  async execute(input: AcceptInviteInput): Promise<AcceptInviteOutput> {
    const invite = await this.inviteRepository.findOne({
      where: { token: input.token },
    })

    if (!invite) {
      throw new NotFoundException("Invite not found or invalid token")
    }

    if (new Date() > invite.expiresAt) {
      throw new BadRequestException("Invite has expired")
    }

    const user = await this.userSchemaRepository.findOne({
      where: { id: input.userId },
      relations: ["role", "kurin"],
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    let result: AcceptInviteOutput

    switch (invite.type) {
      case InviteType.LIAISON:
        result = await this.handleLiaisonInvite(user, invite)
        break

      case InviteType.FOREMAN:
        result = await this.handleForemanInvite(user, invite)
        break

      case InviteType.SCOUT:
        result = await this.handleScoutInvite(user, invite)
        break

      case InviteType.CO_FOREMAN:
        result = await this.handleCoForemanInvite(user, invite)
        break

      default:
        throw new BadRequestException(`Unknown invite type: ${invite.type}`)
    }

    await this.inviteRepository.remove(invite)

    return result
  }

  private async handleLiaisonInvite(user: UserSchema, invite: InviteSchema): Promise<AcceptInviteOutput> {
    const liaisonRole = await this.roleRepository.findOne({ where: { name: Role.LIAISON } })
    if (!liaisonRole) {
      throw new NotFoundException("LIAISON role not found")
    }

    const kurin = await this.kurinRepository.findOne({ where: { id: invite.contextId } })
    if (!kurin) {
      throw new NotFoundException(`Kurin with ID ${invite.contextId} not found`)
    }

    user.role = liaisonRole
    user.kurin = kurin
    kurin.liaison = user

    await this.userSchemaRepository.save(user)
    await this.kurinRepository.save(kurin)

    return {
      message: "Successfully accepted LIAISON invite",
      roleAssigned: Role.LIAISON,
      kurinId: invite.contextId,
      kurinName: kurin.name,
    }
  }

  private async handleForemanInvite(user: UserSchema, invite: InviteSchema): Promise<AcceptInviteOutput> {
    const foremanRole = await this.roleRepository.findOne({ where: { name: Role.FOREMAN } })
    if (!foremanRole) {
      throw new NotFoundException("FOREMAN role not found")
    }

    const kurin = await this.kurinRepository.findOne({ where: { id: invite.contextId } })
    if (!kurin) {
      throw new NotFoundException(`Kurin with ID ${invite.contextId} not found`)
    }

    user.role = foremanRole
    user.kurin = kurin
    await this.userSchemaRepository.save(user)

    return {
      message: "Successfully accepted FOREMAN invite",
      roleAssigned: Role.FOREMAN,
      kurinId: invite.contextId,
      kurinName: kurin.name,
    }
  }

  private async handleScoutInvite(user: UserSchema, invite: InviteSchema): Promise<AcceptInviteOutput> {
    const scoutRole = await this.roleRepository.findOne({ where: { name: Role.SCOUT } })
    if (!scoutRole) {
      throw new NotFoundException("SCOUT role not found")
    }

    const group = await this.groupRepository.findById(invite.contextId)
    if (!group) {
      throw new NotFoundException(`Group with ID ${invite.contextId} not found`)
    }

    // Get the group owner (foreman) with their kurin to associate scout with the same kurin
    const groupOwner = await this.userSchemaRepository.findOne({
      where: { id: group.owner.id },
      relations: ["kurin"],
    })

    user.role = scoutRole
    if (groupOwner?.kurin) {
      user.kurin = groupOwner.kurin
    }
    await this.userSchemaRepository.save(user)

    const isAlreadyMember = await this.groupRepository.isMember(invite.contextId, user.id)
    if (!isAlreadyMember) {
      await this.groupRepository.addMember(invite.contextId, user.id)
      await this.initializeUserProbas(user.id)
    }

    return {
      message: `Successfully joined group ${group.name}`,
      roleAssigned: Role.SCOUT,
      groupId: invite.contextId,
      groupName: group.name,
    }
  }

  private async handleCoForemanInvite(user: UserSchema, invite: InviteSchema): Promise<AcceptInviteOutput> {
    const foremanRole = await this.roleRepository.findOne({ where: { name: Role.FOREMAN } })
    if (!foremanRole) {
      throw new NotFoundException("FOREMAN role not found")
    }

    const group = await this.groupRepository.findById(invite.contextId)
    if (!group) {
      throw new NotFoundException(`Group with ID ${invite.contextId} not found`)
    }

    user.role = foremanRole
    await this.userSchemaRepository.save(user)

    const isAlreadyMember = await this.groupRepository.isMember(invite.contextId, user.id)
    if (!isAlreadyMember) {
      await this.groupRepository.addMember(invite.contextId, user.id)
    }

    return {
      message: `Successfully joined group ${group.name} as co-foreman`,
      roleAssigned: Role.FOREMAN,
      groupId: invite.contextId,
      groupName: group.name,
    }
  }

  private async initializeUserProbas(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user || !user.sex) {
      return
    }

    const existingProgress = await this.probaRepository.getUserProbaProgress(userId)

    const hasProbasInitialized =
      Object.keys(existingProgress.zeroProba).length > 0 || Object.keys(existingProgress.firstProba).length > 0 || Object.keys(existingProgress.secondProba).length > 0

    if (hasProbasInitialized) {
      return
    }

    await this.probaRepository.initializeUserProbas(userId, user.sex)
  }
}
