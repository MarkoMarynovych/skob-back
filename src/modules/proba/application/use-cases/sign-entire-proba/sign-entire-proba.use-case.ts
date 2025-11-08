import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { OrganizedProbaProgress } from "~modules/proba/domain/types/organized-proba-progress.type"
import { SignEntireProbaDto } from "../../dto/sign-entire-proba.dto"

interface ProbaItem {
  is_completed: boolean
  proba_item: { id: string }
}

@Injectable()
export class SignEntireProbaUseCase {
  constructor(
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository
  ) {}

  async execute(dto: SignEntireProbaDto): Promise<void> {
    const userProgress = await this.probaRepository.getUserProbaProgress(dto.userId)
    const probaKey = dto.probaName as keyof Pick<OrganizedProbaProgress, "zeroProba" | "firstProba" | "secondProba">

    if (!userProgress) {
      throw new NotFoundException("User proba progress not found")
    }

    const probaItems = Object.values(userProgress[probaKey]).flat()

    for (const progress of probaItems) {
      if (progress.is_completed !== dto.status) {
        await this.probaRepository.signProbaItem(dto.userId, progress.proba_item.id, dto.foremanId, dto.status)
      }
    }
  }
}
