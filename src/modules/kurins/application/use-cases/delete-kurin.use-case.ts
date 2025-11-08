import { Inject, Injectable } from "@nestjs/common"
import { IKurinRepository, KurinDITokens } from "~modules/kurins/domain/repositories/kurin.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface DeleteKurinInput {
  kurinId: string
}

@Injectable()
export class DeleteKurinUseCase implements IUseCase<DeleteKurinInput, void> {
  constructor(
    @Inject(KurinDITokens.KURIN_REPOSITORY)
    private readonly kurinRepository: IKurinRepository
  ) {}

  async execute({ kurinId }: DeleteKurinInput): Promise<void> {
    await this.kurinRepository.delete(kurinId)
  }
}
