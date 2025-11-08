import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { UserMapper } from "~modules/users/domain/mappers/user/user.mapper"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserDto } from "../../dto/user.dto"

interface IGetUserPayload {
  userEmail: string
}

@Injectable()
export class GetUserUseCase implements IUseCase<IGetUserPayload, UserDto> {
  constructor(
    @Inject(UserDiToken.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper
  ) {}

  public async execute(input: IGetUserPayload): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(input.userEmail)
    if (!user) {
      throw new NotFoundException(`User not found with email ${input.userEmail}`)
    }
    return this.userMapper.toDto(user)
  }
}
