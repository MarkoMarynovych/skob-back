import { Body, Controller, Get, Inject, Logger } from "@nestjs/common"
import { Public } from "~modules/common/decorators/public.decorator"
import { GetUserUseCase } from "~modules/users/application/use-cases/get-user/get-user.use-case"
import { UserDiToken } from "../../constants/user-constants"

@Controller("users")
export class UsersController {
  constructor(@Inject(UserDiToken.GET_USER_USE_CASE) private readonly getUserUseCase: GetUserUseCase) {}
  private readonly logger = new Logger(UsersController.name)

  @Public()
  @Get("me")
  async getMyAccount(@Body("email") email: string) {
    this.logger.log("GET: /users/me")
    const user = await this.getUserUseCase.execute({ userEmail: email })
    return user
  }
  // @UsePipes(new ValidationPipe())
  // @Patch("/:email")
  // async updateUser(@Param() params: EmailDto, @Body() updatePayload: UpdateUserDto, @User() { email: requestEmail }: JwtPayloadDto) {
  //   this.logger.log("PATCH: /users/me")
  //   const user = await this.userService.updateUser(updatePayload, params.email, requestEmail)
  //   return UpdateUserDto.toDto(user)
  // }

  // @Roles(Role.FOREMAN)
  // @UsePipes(new ValidationPipe())
  // @Get(":email")
  // async getUserByEmail(@Param() params: EmailDto, @User() { email: requestEmail }: JwtPayloadDto) {
  //   this.logger.log("GET: /users/:email")
  //   const user = await this.userService.getUserByEmail(params.email)
  //   if (!user) {
  //     throw new NotFoundException(`User not found with email ${params.email} not found.`)
  //   }
  //   if (user.ownerEmail !== requestEmail) {
  //     throw new ForbiddenException(`access is denied to a Scout who is not in the your group`)
  //   }
  //   return UserDto.toDto(user)
  // }

  // @Get("scouts/all")
  // @Roles(Role.FOREMAN)
  // async getAllScoutsByForemanEmail(@User() { email }: JwtPayloadDto) {
  //   this.logger.log("GET: /users/scouts/all")
  //   const scouts = await this.userService.getAllScoutsByForemanEmail(email)
  //   if (!scouts || !scouts.length) {
  //     throw new NotFoundException(`Foreman does not have scouts`)
  //   }
  //   return UserDto.toDtoList(scouts)
  // }

  // @UsePipes(new ValidationPipe())
  // @Roles(Role.FOREMAN)
  // @Delete(":email")
  // async removeScoutFromGroup(@Param() params: EmailDto, @User() { email: foremanEmail }: JwtPayloadDto) {
  //   this.logger.log("DELETE: /users/:email")
  //   await this.userService.removeScoutFromGroup(params.email, foremanEmail)
  // }
}
