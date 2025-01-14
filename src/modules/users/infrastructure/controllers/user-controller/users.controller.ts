import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, UsePipes, ValidationPipe } from "@nestjs/common"
import { JwtPayloadDto } from "~modules/auth/application/dto/jwtpayload.dto"
import { Public } from "~modules/common/decorators/public.decorator"
import { Roles } from "~modules/common/decorators/roles.decorator"
import { User } from "~modules/common/decorators/user.decorator"
import { EmailDto } from "~modules/common/dto/email.dto"
import { UpdateUserDto } from "~modules/users/application/dto/update.user.dto"
import { GetScoutByForemanEmailUseCase } from "~modules/users/application/use-cases/get-scout-by-foreman-email/get-scout-by-foreman-email.use-case"
import { GetUserUseCase } from "~modules/users/application/use-cases/get-user/get-user.use-case"
import { RemoveScoutFromGroupUseCase } from "~modules/users/application/use-cases/remove-scout-from-group/remove-scout-from-group.use-case"
import { UpdateUserUseCase } from "~modules/users/application/use-cases/update-user/update-user.use-case"
import { Role } from "~shared/domain/enums/role.enum"
import { UserDiToken } from "../../constants/user-constants"

@Controller("users")
export class UsersController {
  constructor(
    @Inject(UserDiToken.GET_USER_USE_CASE) private readonly getUserUseCase: GetUserUseCase,
    @Inject(UserDiToken.UPDATE_USER_USE_CASE) private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(UserDiToken.GET_SCOUT_BY_FOREMAN_EMAIL_USE_CASE) private readonly getScoutByForemanEmailUseCase: GetScoutByForemanEmailUseCase,
    @Inject(UserDiToken.REMOVE_SCOUT_FROM_GROUP_USE_CASE) private readonly removeScoutFromGroupUseCase: RemoveScoutFromGroupUseCase
  ) {}
  private readonly logger = new Logger(UsersController.name)

  @Public()
  @Get("me")
  async getMyAccount(@Body("email") email: string) {
    this.logger.log("GET: /users/me")
    const user = await this.getUserUseCase.execute({ userEmail: email })
    return user
  }

  @UsePipes(new ValidationPipe())
  @Patch("/:email")
  async updateUser(@Param() params: EmailDto, @Body() updatePayload: UpdateUserDto, @User() { email: requestEmail }: JwtPayloadDto) {
    this.logger.log("PATCH: /users/:email")
    return await this.updateUserUseCase.execute({
      updateData: updatePayload,
      targetEmail: params.email,
      requestEmail,
    })
  }

  @Roles(Role.FOREMAN)
  @UsePipes(new ValidationPipe())
  @Get(":email")
  async getUserByEmail(@Param() params: EmailDto, @User() { email: requestEmail }: JwtPayloadDto) {
    this.logger.log("GET: /users/:email")
    return await this.getUserUseCase.execute({ userEmail: params.email })
  }

  @Get("scouts/all")
  @Roles(Role.FOREMAN)
  async getAllScoutsByForemanEmail(@User() { email }: JwtPayloadDto) {
    this.logger.log("GET: /users/scouts/all")
    const scouts = await this.getScoutByForemanEmailUseCase.execute({ foremanEmail: email })
    return scouts
  }

  @UsePipes(new ValidationPipe())
  @Roles(Role.FOREMAN)
  @Delete(":email")
  async removeScoutFromGroup(@Param() params: EmailDto, @User() { email: foremanEmail }: JwtPayloadDto) {
    this.logger.log("DELETE: /users/:email")
    await this.removeScoutFromGroupUseCase.execute({ foremanEmail, scoutEmail: params.email })
  }
}
