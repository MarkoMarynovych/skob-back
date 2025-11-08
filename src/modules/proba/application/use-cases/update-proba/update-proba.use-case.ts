import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { UpdateProbaDto } from "../../dto/update-proba.dto"

@Injectable()
export class UpdateProbaUseCase {
  constructor(
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository
  ) {}

  async execute(dto: UpdateProbaDto): Promise<void> {
    const userProgress = await this.probaRepository.getUserProbaProgress(dto.userId)
    if (!userProgress) {
      throw new NotFoundException("User proba progress not found")
    }

    await this.probaRepository.signProbaItem(dto.userId, dto.itemId, dto.foremanId, dto.status)
  }
}
