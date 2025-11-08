import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IKurinRepository, KurinDITokens, KurinDetails } from "~modules/kurins/domain/repositories/kurin.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface GetKurinInput {
  kurinId: string
}

@Injectable()
export class GetKurinUseCase implements IUseCase<GetKurinInput, KurinDetails> {
  constructor(
    @Inject(KurinDITokens.KURIN_REPOSITORY)
    private readonly kurinRepository: IKurinRepository
  ) {}

  async execute(input: GetKurinInput): Promise<KurinDetails> {
    const kurin = await this.kurinRepository.findByIdWithForemen(input.kurinId)

    if (!kurin) {
      throw new NotFoundException(`Kurin with ID ${input.kurinId} not found`)
    }

    return kurin
  }
}
