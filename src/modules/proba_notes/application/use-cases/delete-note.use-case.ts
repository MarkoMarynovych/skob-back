import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { IProbaNoteRepository, ProbaNotesDITokens } from "~modules/proba_notes/domain/repositories/proba-notes.repository.interface"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

interface IDeleteNotePayload {
  noteId: string
  userId: string
}

@Injectable()
export class DeleteNoteUseCase implements IUseCase<IDeleteNotePayload, void> {
  constructor(
    @Inject(ProbaNotesDITokens.PROBA_NOTES_REPOSITORY)
    private readonly probaNoteRepository: IProbaNoteRepository
  ) {}

  public async execute(input: IDeleteNotePayload): Promise<void> {
    // Find the note with createdBy relation
    const note = await this.probaNoteRepository.findById(input.noteId)

    if (!note) {
      throw new NotFoundException(`Note with id ${input.noteId} not found`)
    }

    // Verify that the user is the creator
    if (note.createdBy.id !== input.userId) {
      throw new ForbiddenException("You can only delete notes that you created")
    }

    // Delete the note
    await this.probaNoteRepository.delete(input.noteId)
  }
}
