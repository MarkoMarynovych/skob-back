import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IProbaNoteRepository } from "~modules/proba_notes/domain/repositories/proba-notes.repository.interface"
import { ProbaNoteSchema } from "~shared/infrastructure/database/postgres/schemas/proba-note.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

@Injectable()
export class ProbaNoteRepository implements IProbaNoteRepository {
  constructor(
    @InjectRepository(ProbaNoteSchema)
    private readonly probaNoteRepository: Repository<ProbaNoteSchema>,
    @InjectRepository(UserProbaProgressSchema)
    private readonly progressRepository: Repository<UserProbaProgressSchema>,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>
  ) {}

  async create(content: string, progressId: string, createdById: string): Promise<ProbaNoteSchema> {
    const progress = await this.progressRepository.findOne({
      where: { id: progressId },
    })

    if (!progress) {
      throw new Error("Progress not found")
    }

    const createdBy = await this.userRepository.findOne({
      where: { id: createdById },
    })

    if (!createdBy) {
      throw new Error("User not found")
    }

    const note = this.probaNoteRepository.create({
      content,
      progress,
      createdBy,
    })

    return await this.probaNoteRepository.save(note)
  }

  async findById(noteId: string): Promise<ProbaNoteSchema | null> {
    return await this.probaNoteRepository.findOne({
      where: { id: noteId },
      relations: ["progress", "progress.user", "progress.user.memberships", "createdBy"],
    })
  }

  async update(noteId: string, content: string): Promise<ProbaNoteSchema> {
    const note = await this.probaNoteRepository.findOne({
      where: { id: noteId },
    })

    if (!note) {
      throw new Error("Note not found")
    }

    note.content = content
    return await this.probaNoteRepository.save(note)
  }

  async delete(noteId: string): Promise<void> {
    const result = await this.probaNoteRepository.delete(noteId)

    if (result.affected === 0) {
      throw new Error("Note not found")
    }
  }
}
