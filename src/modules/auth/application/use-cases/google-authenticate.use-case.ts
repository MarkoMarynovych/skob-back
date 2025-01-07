import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { CreateUserMapper } from "~modules/auth/domain/mappers/create-user.mapper"
import { UserDto } from "~modules/users/application/dto/user.dto"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"

export interface IArrangeSubscriptionPayload {
  user: UserDto
}

@Injectable()
export class AuthenticateUserUseCase implements IUseCase<IArrangeSubscriptionPayload, UserDto> {
  constructor(
    @Inject(UserDiToken.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly createUserMapper: CreateUserMapper
  ) {}

  public async execute(input: IArrangeSubscriptionPayload): Promise<UserDto> {
    try {
      if (!input.user) {
        throw new UnauthorizedException("The account with this email address was not registered through Google")
      }

      const userDb = await this.userRepository.findByEmail(input.user.email).catch((error) => {
        throw new InternalServerErrorException("Failed to fetch user from database: " + error.message)
      })

      if (!userDb) {
        const createUser = await this.userRepository
          .save({
            ...input.user,
            is_guide_complete: false,
          })
          .catch((error) => {
            throw new InternalServerErrorException("Failed to create new user: " + error.message)
          })

        return await this.signToken(this.createUserMapper.toDto(createUser) as UserDto)
      }

      return await this.signToken(this.createUserMapper.toDto(userDb) as UserDto)
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error
      }
      throw new InternalServerErrorException("Authentication failed: " + error.message)
    }
  }

  private async signToken(user: UserDto) {
    try {
      const payload = { sub: user.id, email: user.email }
      return {
        ...user,
        token: await this.jwtService.signAsync(payload),
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to generate authentication token: " + error.message)
    }
  }
}
