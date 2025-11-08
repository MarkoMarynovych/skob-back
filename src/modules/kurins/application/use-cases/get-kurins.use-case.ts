import { Inject, Injectable } from "@nestjs/common"
import { IKurinRepository, KurinDITokens, KurinStats } from "~modules/kurins/domain/repositories/kurin.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

@Injectable()
export class GetKurinsUseCase implements IUseCase<void, KurinStats[]> {
  constructor(
    @Inject(KurinDITokens.KURIN_REPOSITORY)
    private readonly kurinRepository: IKurinRepository
  ) {}

  async execute(): Promise<KurinStats[]> {
    return await this.kurinRepository.findAllWithStats()
  }
}
