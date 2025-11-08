import { Body, Controller, Get, Header, Inject, Logger, Param, Patch, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { JwtPayloadDto } from "~modules/auth/application/dto/jwtpayload.dto"
import { Public } from "~modules/common/decorators/public.decorator"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { RolesGuard } from "~modules/common/guards/roles.guard"
import { KurinAccessGuard } from "~modules/common/guards/kurin-access.guard"
import { User } from "~modules/common/decorators/user.decorator"
import { EmailDto } from "~modules/common/dto/email.dto"
import { UpdateUserDto } from "~modules/users/application/dto/update.user.dto"
import { GetUserUseCase } from "~modules/users/application/use-cases/get-user/get-user.use-case"
import { GetLiaisonsUseCase } from "~modules/users/application/use-cases/get-liaisons/get-liaisons.use-case"
import { GetForemenUseCase } from "~modules/users/application/use-cases/get-foremen/get-foremen.use-case"
import { GetForemanDetailsUseCase } from "~modules/users/application/use-cases/get-foreman-details/get-foreman-details.use-case"
import { UpdateUserUseCase } from "~modules/users/application/use-cases/update-user/update-user.use-case"
import { Role } from "~modules/users/application/enums/role.enum"
import { UserDiToken } from "../../constants/user-constants"

@Controller("users")
export class UsersController {
  constructor(
    @Inject(UserDiToken.GET_USER_USE_CASE) private readonly getUserUseCase: GetUserUseCase,
    @Inject(UserDiToken.GET_LIAISONS_USE_CASE) private readonly getLiaisonsUseCase: GetLiaisonsUseCase,
    @Inject(UserDiToken.GET_FOREMEN_USE_CASE) private readonly getForemenUseCase: GetForemenUseCase,
    @Inject(UserDiToken.GET_FOREMAN_DETAILS_USE_CASE) private readonly getForemanDetailsUseCase: GetForemanDetailsUseCase,
    @Inject(UserDiToken.UPDATE_USER_USE_CASE) private readonly updateUserUseCase: UpdateUserUseCase
  ) {}
  private readonly logger = new Logger(UsersController.name)

  @Get("me")
  @Header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  async getMyAccount(@User() { email }: JwtPayloadDto) {
    this.logger.log("GET: /users/me")
    const user = await this.getUserUseCase.execute({ userEmail: email })
    return user
  }

  @UsePipes(new ValidationPipe())
  @Patch("/:email")
  async updateUser(@Param() params: EmailDto, @Body() updatePayload: UpdateUserDto, @User() { email: requestEmail }: JwtPayloadDto) {
    this.logger.log(`PATCH: /users/:email - Params: ${JSON.stringify(params)}, Body: ${JSON.stringify(updatePayload)}, RequestEmail: ${requestEmail}`)
    const result = await this.updateUserUseCase.execute({
      updateData: updatePayload,
      targetEmail: params.email,
      requestEmail,
    })
    this.logger.log(`PATCH: /users/:email - Update successful for ${params.email}`)
    return result
  }

  @Get("liaisons")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getLiaisons() {
    this.logger.log("GET: /users/liaisons")
    return await this.getLiaisonsUseCase.execute()
  }

  @Get("foremen")
  @UseGuards(RolesGuard)
  @Roles(Role.LIAISON, Role.ADMIN)
  async getForemen() {
    this.logger.log("GET: /users/foremen")
    return await this.getForemenUseCase.execute()
  }

  @Get("foremen/:foremanId")
  @UseGuards(RolesGuard, KurinAccessGuard)
  @Roles(Role.LIAISON, Role.ADMIN)
  async getForemanDetails(@Param("foremanId") foremanId: string) {
    this.logger.log(`GET: /users/foremen/${foremanId}`)
    return await this.getForemanDetailsUseCase.execute({ foremanId })
  }

  @UseGuards(RolesGuard)
  @Roles(Role.FOREMAN)
  @UsePipes(new ValidationPipe())
  @Get(":email")
  async getUserByEmail(@Param() params: EmailDto, @User() { email: requestEmail }: JwtPayloadDto) {
    this.logger.log("GET: /users/:email")
    return await this.getUserUseCase.execute({ userEmail: params.email })
  }

  // Note: Scout management is now handled by the Groups module
  // GET /groups - to get user's groups with members
  // POST /groups/:groupId/members - to add members
  // DELETE /groups/:groupId/members/:userId - to remove members (to be implemented)
}
