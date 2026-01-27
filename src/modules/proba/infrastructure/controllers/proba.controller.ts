import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { JwtPayloadDto } from "~modules/auth/application/dto/jwtpayload.dto"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { User } from "~modules/common/decorators/user.decorator"
import { RolesGuard } from "~modules/common/guards/roles.guard"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { Role } from "~modules/users/application/enums/role.enum"
import { AssignProbaDto } from "../../application/dto/assign-proba.dto"
import { SignEntireProbaDto } from "../../application/dto/sign-entire-proba.dto"
import { UpdateProbaDto } from "../../application/dto/update-proba.dto"
import { AssignProbaUseCase } from "../../application/use-cases/assign-proba/assign-proba.use-case"
import { CreateUserProbaUseCase } from "../../application/use-cases/create-user-proba/create-user-proba.use-case"
import { SignEntireProbaUseCase } from "../../application/use-cases/sign-entire-proba/sign-entire-proba.use-case"
import { UpdateProbaUseCase } from "../../application/use-cases/update-proba/update-proba.use-case"

@Controller("probas")
export class ProbaController {
  constructor(
    @Inject(ProbaDITokens.UPDATE_PROBA_USE_CASE)
    private readonly updateProbaUseCase: UpdateProbaUseCase,
    @Inject(ProbaDITokens.SIGN_ENTIRE_PROBA_USE_CASE)
    private readonly signEntireProbaUseCase: SignEntireProbaUseCase,
    @Inject(ProbaDITokens.ASSIGN_PROBA_USE_CASE)
    private readonly assignProbaUseCase: AssignProbaUseCase,
    @Inject(ProbaDITokens.CREATE_USER_PROBA_USE_CASE)
    private readonly createUserProbaUseCase: CreateUserProbaUseCase,
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository
  ) {}

  @Post("users/:userId/initialize")
  async initializeUserProbas(@Param("userId") userId: string): Promise<{ message: string }> {
    console.log("[ProbaController] POST /users/:userId/initialize called with userId:", userId)
    await this.createUserProbaUseCase.execute(userId)
    console.log("[ProbaController] Use case executed successfully")
    return { message: "Probas initialized successfully" }
  }

  @Get(":userId")
  async getUserProbas(@Param("userId") userId: string) {
    console.log(`[ProbaController] GET /probas/:userId called for userId: ${userId}`)
    const result = await this.probaRepository.getUserProbaProgress(userId)
    console.log(`[ProbaController] Returning progress data for userId: ${userId}`)
    return result
  }

  @Patch("item")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  async signProbaItem(@Body() dto: UpdateProbaDto): Promise<void> {
    await this.updateProbaUseCase.execute(dto)
  }

  @Patch("entire")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  async signEntireProba(@Body() dto: SignEntireProbaDto): Promise<void> {
    await this.signEntireProbaUseCase.execute(dto)
  }

  @Post("users/:scoutId/probas")
  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN, Role.LIAISON, Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async assignProba(@Param("scoutId") scoutId: string, @Body() dto: AssignProbaDto, @User() { sub: foremanId }: JwtPayloadDto): Promise<void> {
    await this.assignProbaUseCase.execute({ scoutId, dto, foremanId })
  }
}
