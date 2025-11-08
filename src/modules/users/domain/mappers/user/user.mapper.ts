import { Injectable } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { UserDto } from "~modules/users/application/dto/user.dto"
import { User } from "../../entities/user.entity"

@Injectable()
export class UserMapper {
  public toDto(user: User): UserDto {
    if (!user.role) {
      throw new Error(`User ${user.email} is missing a role`)
    }

    return plainToInstance(UserDto, {
      id: user.id,
      name: user.name,
      email: user.email,
      sex: user.sex,
      is_guide_complete: user.is_guide_complete,
      picture: user.picture,
      role: user.role,
      kurin: user.kurin,
    } satisfies UserDto)
  }
}
