import { Inject, Injectable } from "@nestjs/common"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { UserDiToken } from "~modules/users/infrastructure/constants/user-constants"
import { IUseCase } from "~shared/application/use-cases/use-case.interface"
import { UserDto } from "../../dto/user.dto"

@Injectable()
export class GetLiaisonsUseCase implements IUseCase<void, UserDto[]> {
  constructor(@Inject(UserDiToken.USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

  public async execute(): Promise<UserDto[]> {
    const liaisonsWithStats = await this.userRepository.findLiaisonsWithStats()
    return liaisonsWithStats.map((liaison) => ({
      id: liaison.id,
      name: liaison.name,
      email: liaison.email,
      picture: liaison.picture,
      role: "LIAISON" as any,
      is_guide_complete: false,
      foremanCount: liaison.foremanCount,
      totalScouts: liaison.totalScouts,
    }))
  }
}
