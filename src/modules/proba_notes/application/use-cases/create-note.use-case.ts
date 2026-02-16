import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IGroupRepository, GroupDITokens } from "~modules/groups/domain/repositories/group.repository.interface"
import { IProbaNoteRepository, ProbaNotesDITokens } from "~modules/proba_notes/domain/repositories/proba-notes.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { ProbaNoteSchema } from "~shared/infrastructure/database/postgres/schemas/proba-note.schema"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"

interface ICreateNotePayload {
  content: string
  progressId: string
  foremanId: string
}

@Injectable()
export class CreateNoteUseCase implements IUseCase<ICreateNotePayload, ProbaNoteSchema> {
  constructor(
    @Inject(ProbaNotesDITokens.PROBA_NOTES_REPOSITORY)
    private readonly probaNoteRepository: IProbaNoteRepository,
    @Inject(GroupDITokens.GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @InjectRepository(UserProbaProgressSchema)
    private readonly progressRepository: Repository<UserProbaProgressSchema>
  ) {}

  public async execute(input: ICreateNotePayload): Promise<ProbaNoteSchema> {
    // Get the progress item with user relation
    const progress = await this.progressRepository.findOne({
      where: { id: input.progressId },
      relations: ["user"],
    })

    if (!progress) {
      throw new NotFoundException(`Progress with id ${input.progressId} not found`)
    }

    const scoutId = progress.user.id

    const isAuthorized = await this.groupRepository.isOwnerOrForemanOfScoutGroup(input.foremanId, scoutId)
    if (!isAuthorized) {
      throw new ForbiddenException("You can only create notes for scouts in your groups")
    }

    // Create the note
    return await this.probaNoteRepository.create(input.content, input.progressId, input.foremanId)
  }
}
