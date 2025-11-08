import { ProbaNoteSchema } from "~shared/infrastructure/database/postgres/schemas/proba-note.schema"

export interface IProbaNoteRepository {
  create(content: string, progressId: string, createdById: string): Promise<ProbaNoteSchema>
  findById(noteId: string): Promise<ProbaNoteSchema | null>
  update(noteId: string, content: string): Promise<ProbaNoteSchema>
  delete(noteId: string): Promise<void>
}

export const ProbaNotesDITokens = {
  PROBA_NOTES_REPOSITORY: Symbol("PROBA_NOTES_REPOSITORY"),
}
