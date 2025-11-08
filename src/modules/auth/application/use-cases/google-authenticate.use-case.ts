import { Inject, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { CreateUserMapper } from "~modules/auth/domain/mappers/create-user.mapper"
import { UserDto } from "~modules/users/application/dto/user.dto"
import { Role } from "~modules/users/application/enums/role.enum"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserMapper } from "~modules/users/domain/mappers/user/user.mapper"

export interface IArrangeGoogleAuthenticationPayload {
  user: UserDto
}

@Injectable()
export class AuthenticateUserUseCase implements IUseCase<IArrangeGoogleAuthenticationPayload, { token: string; user: UserDto }> {
  private readonly logger = new Logger(AuthenticateUserUseCase.name)

  constructor(
    @Inject(UserDiToken.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly createUserMapper: CreateUserMapper,
    private readonly userMapper: UserMapper // Inject the UserMapper
  ) {}

  async execute(input: IArrangeGoogleAuthenticationPayload): Promise<{ token: string; user: UserDto }> {
    if (!input.user) {
      throw new UnauthorizedException("No user from google")
    }

    let user
    let userExistsWithoutRole = false

    // Try to find user in DB
    try {
      user = await this.userRepository.findByEmail(input.user.email)
    } catch (error) {
      // Check if error is "no role assigned" - this means user exists but broken
      if (error.message && error.message.includes("has no role assigned")) {
        userExistsWithoutRole = true
      } else {
        throw error
      }
    }

    // If user does not exist, create a new user
    if (!user && !userExistsWithoutRole) {
      await this.userRepository.create({
        name: input.user.name,
        email: input.user.email,
        sex: input.user.sex,
        picture: input.user.picture,
        is_guide_complete: false,
      })

      // Refetch the user to ensure all relationships are properly loaded
      try {
        user = await this.userRepository.findByEmail(input.user.email)
      } catch (error) {
        throw new InternalServerErrorException("Failed to fetch user after creation: " + error.message)
      }
    }

    // If user exists but has no role, fix this by assigning SCOUT role
    if (userExistsWithoutRole) {
      this.logger.warn(`User ${input.user.email} exists but has no role. Attempting to fix by assigning SCOUT role...`)

      try {
        user = await this.userRepository.update(input.user.email, { role: Role.SCOUT })
        this.logger.log(`Successfully assigned SCOUT role to ${input.user.email}`)
      } catch (error) {
        throw new InternalServerErrorException(`Failed to assign role to existing user ${input.user.email}: ${error.message}`)
      }
    }

    if (!user) {
      throw new InternalServerErrorException("Failed to create or find user")
    }

    // Now we have a full user object with a role, map it to a DTO
    const userDto = this.userMapper.toDto(user)

    const token = await this.signToken(userDto)

    return { token, user: userDto }
  }

  private async signToken(user: UserDto): Promise<string> {
    if (!user.role) {
      // This should never happen now, but it's a good safeguard
      throw new InternalServerErrorException(`User ${user.email} has no role and a token cannot be signed.`)
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role, // The role is now guaranteed to be here
    }

    try {
      return await this.jwtService.signAsync(payload)
    } catch (error) {
      throw new InternalServerErrorException("Failed to sign token: " + error.message)
    }
  }
}
