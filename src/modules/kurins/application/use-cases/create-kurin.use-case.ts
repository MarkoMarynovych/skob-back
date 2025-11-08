import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IKurinRepository, KurinDITokens } from "~modules/kurins/domain/repositories/kurin.repository.interface"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { CreateKurinDto } from "../dto/create-kurin.dto"
import { Role } from "~modules/users/application/enums/role.enum"

interface CreateKurinInput {
  dto: CreateKurinDto
}

export interface CreateKurinOutput {
  id: string
  name: string
  liaisonId?: string
}

@Injectable()
export class CreateKurinUseCase implements IUseCase<CreateKurinInput, CreateKurinOutput> {
  constructor(
    @Inject(KurinDITokens.KURIN_REPOSITORY)
    private readonly kurinRepository: IKurinRepository,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>
  ) {}

  async execute(input: CreateKurinInput): Promise<CreateKurinOutput> {
    let liaison = undefined

    if (input.dto.liaisonId) {
      liaison = await this.userRepository.findOne({
        where: { id: input.dto.liaisonId },
        relations: ["role"],
      })

      if (!liaison) {
        throw new NotFoundException(`User with ID ${input.dto.liaisonId} not found`)
      }

      if (!liaison.role || liaison.role.name !== Role.LIAISON) {
        throw new BadRequestException(`User must have LIAISON role`)
      }
    }

    const kurin = await this.kurinRepository.create(input.dto.name, liaison)

    return {
      id: kurin.id,
      name: kurin.name,
      liaisonId: kurin.liaison?.id,
    }
  }
}
