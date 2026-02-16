import { ForbiddenException, Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { AssignProbaDto } from "../../dto/assign-proba.dto"

interface IAssignProbaPayload {
  scoutId: string
  dto: AssignProbaDto
  foremanId: string
}

@Injectable()
export class AssignProbaUseCase implements IUseCase<IAssignProbaPayload, void> {
  constructor(
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository,
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>
  ) {}

  public async execute(input: IAssignProbaPayload): Promise<void> {
    // Verify scout exists
    const scout = await this.userRepository.findOne({ where: { id: input.scoutId } })
    if (!scout) {
      throw new ForbiddenException(`Scout with id ${input.scoutId} not found`)
    }

    // Check if scout has gender set
    if (!scout.sex) {
      throw new ForbiddenException("Scout must complete onboarding (set gender) before probas can be assigned")
    }

    const isAuthorized = await this.groupRepository.isOwnerOrForemanOfScoutGroup(input.foremanId, input.scoutId)
    if (!isAuthorized) {
      throw new ForbiddenException("You can only assign probas to scouts in your groups")
    }

    // Initialize all proba templates for the scout based on their gender
    await this.probaRepository.initializeUserProbas(input.scoutId, scout.sex)
  }
}
