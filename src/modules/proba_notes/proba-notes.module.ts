import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupsModule } from "~modules/groups/groups.module"
import { UsersModule } from "~modules/users/users.module"
import { ProbaNoteSchema } from "~shared/infrastructure/database/postgres/schemas/proba-note.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { CreateNoteUseCase } from "./application/use-cases/create-note.use-case"
import { DeleteNoteUseCase } from "./application/use-cases/delete-note.use-case"
import { UpdateNoteUseCase } from "./application/use-cases/update-note.use-case"
import { ProbaNotesDITokens } from "./domain/repositories/proba-notes.repository.interface"
import { ProbaNotesDiToken } from "./infrastructure/constants/proba-notes-constants"
import { ProbaNotesController } from "./infrastructure/controllers/proba-notes.controller"
import { ProbaNoteRepository } from "./infrastructure/repositories/proba-notes.repository"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

@Module({
  imports: [TypeOrmModule.forFeature([ProbaNoteSchema, UserProbaProgressSchema, UserSchema]), UsersModule, GroupsModule],
  controllers: [ProbaNotesController],
  providers: [
    {
      provide: ProbaNotesDITokens.PROBA_NOTES_REPOSITORY,
      useClass: ProbaNoteRepository,
    },
    {
      provide: ProbaNotesDiToken.CREATE_NOTE_USE_CASE,
      useClass: CreateNoteUseCase,
    },
    {
      provide: ProbaNotesDiToken.UPDATE_NOTE_USE_CASE,
      useClass: UpdateNoteUseCase,
    },
    {
      provide: ProbaNotesDiToken.DELETE_NOTE_USE_CASE,
      useClass: DeleteNoteUseCase,
    },
  ],
})
export class ProbaNotesModule {}
