import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IProbaNoteRepository, ProbaNotesDITokens } from "~modules/proba_notes/domain/repositories/proba-notes.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { ProbaNoteSchema } from "~shared/infrastructure/database/postgres/schemas/proba-note.schema"

interface IUpdateNotePayload {
  noteId: string
  content: string
  userId: string
}

@Injectable()
export class UpdateNoteUseCase implements IUseCase<IUpdateNotePayload, ProbaNoteSchema> {
  constructor(
    @Inject(ProbaNotesDITokens.PROBA_NOTES_REPOSITORY)
    private readonly probaNoteRepository: IProbaNoteRepository
  ) {}

  public async execute(input: IUpdateNotePayload): Promise<ProbaNoteSchema> {
    // Find the note with createdBy relation
    const note = await this.probaNoteRepository.findById(input.noteId)

    if (!note) {
      throw new NotFoundException(`Note with id ${input.noteId} not found`)
    }

    // Verify that the user is the creator
    if (note.createdBy.id !== input.userId) {
      throw new ForbiddenException("You can only update notes that you created")
    }

    // Update the note
    return await this.probaNoteRepository.update(input.noteId, input.content)
  }
}
