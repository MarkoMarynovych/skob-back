import { Body, Controller, Delete, Inject, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { JwtPayloadDto } from "~modules/auth/application/dto/jwtpayload.dto"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { User } from "~modules/common/decorators/user.decorator"
import { RolesGuard } from "~modules/common/guards/roles.guard"
import { CreateNoteDto } from "~modules/proba_notes/application/dto/create-note.dto"
import { UpdateNoteDto } from "~modules/proba_notes/application/dto/update-note.dto"
import { CreateNoteUseCase } from "~modules/proba_notes/application/use-cases/create-note.use-case"
import { DeleteNoteUseCase } from "~modules/proba_notes/application/use-cases/delete-note.use-case"
import { UpdateNoteUseCase } from "~modules/proba_notes/application/use-cases/update-note.use-case"
import { Role } from "~modules/users/application/enums/role.enum"
import { ProbaNotesDiToken } from "../constants/proba-notes-constants"

@Controller("progress")
export class ProbaNotesController {
  constructor(
    @Inject(ProbaNotesDiToken.CREATE_NOTE_USE_CASE)
    private readonly createNoteUseCase: CreateNoteUseCase,
    @Inject(ProbaNotesDiToken.UPDATE_NOTE_USE_CASE)
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    @Inject(ProbaNotesDiToken.DELETE_NOTE_USE_CASE)
    private readonly deleteNoteUseCase: DeleteNoteUseCase
  ) {}

  @Post(":progressId/notes")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async createNote(@Param("progressId") progressId: string, @Body() createNoteDto: CreateNoteDto, @User() { sub: userId }: JwtPayloadDto) {
    return await this.createNoteUseCase.execute({
      content: createNoteDto.content,
      progressId,
      foremanId: userId,
    })
  }

  @Put("notes/:noteId")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async updateNote(@Param("noteId") noteId: string, @Body() updateNoteDto: UpdateNoteDto, @User() { sub: userId }: JwtPayloadDto) {
    return await this.updateNoteUseCase.execute({
      noteId,
      content: updateNoteDto.content,
      userId,
    })
  }

  @Delete("notes/:noteId")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  async deleteNote(@Param("noteId") noteId: string, @User() { sub: userId }: JwtPayloadDto) {
    await this.deleteNoteUseCase.execute({
      noteId,
      userId,
    })

    return { message: "Note deleted successfully" }
  }
}
