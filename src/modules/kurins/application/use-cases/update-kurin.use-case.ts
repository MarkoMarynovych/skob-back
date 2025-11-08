import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IKurinRepository, KurinDITokens } from "~modules/kurins/domain/repositories/kurin.repository.interface"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UpdateKurinDto } from "../dto/update-kurin.dto"
import { Role } from "~modules/users/application/enums/role.enum"
import { KurinSchema } from "~shared/infrastructure/database/postgres/schemas/kurin.schema"

interface UpdateKurinInput {
  kurinId: string
  dto: UpdateKurinDto
}

@Injectable()
export class UpdateKurinUseCase implements IUseCase<UpdateKurinInput, KurinSchema> {
  constructor(
    @Inject(KurinDITokens.KURIN_REPOSITORY)
    private readonly kurinRepository: IKurinRepository,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>
  ) {}

  async execute(input: UpdateKurinInput): Promise<KurinSchema> {
    const kurin = await this.kurinRepository.findById(input.kurinId)

    if (!kurin) {
      throw new NotFoundException(`Kurin with ID ${input.kurinId} not found`)
    }

    const updateData: { name?: string; liaison?: any } = {}

    if (input.dto.name) {
      updateData.name = input.dto.name
    }

    if (input.dto.liaisonId) {
      const liaison = await this.userRepository.findOne({
        where: { id: input.dto.liaisonId },
        relations: ["role"],
      })

      if (!liaison) {
        throw new NotFoundException(`User with ID ${input.dto.liaisonId} not found`)
      }

      if (!liaison.role || liaison.role.name !== Role.LIAISON) {
        throw new BadRequestException(`User must have LIAISON role`)
      }

      updateData.liaison = liaison
    }

    return await this.kurinRepository.update(input.kurinId, updateData)
  }
}
