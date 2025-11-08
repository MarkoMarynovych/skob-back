import { Inject, Injectable } from "@nestjs/common"
import { UserMapper } from "~modules/users/domain/mappers/user/user.mapper"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserDto } from "../../dto/user.dto"
import { Role } from "../../enums/role.enum"

@Injectable()
export class GetForemenUseCase implements IUseCase<void, UserDto[]> {
  constructor(
    @Inject(UserDiToken.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper
  ) {}

  public async execute(): Promise<UserDto[]> {
    const foremen = await this.userRepository.findByRole(Role.FOREMAN)
    return foremen.map((foreman) => this.userMapper.toDto(foreman))
  }
}
