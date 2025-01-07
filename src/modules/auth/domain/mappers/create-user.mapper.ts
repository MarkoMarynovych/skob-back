import { Injectable } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CreateUserDto } from "~modules/auth/application/dto/create-user.dto"
import { User } from "~modules/users/domain/entities/user.entity"

@Injectable()
export class CreateUserMapper {
  public toDto(user: User): CreateUserDto {
    return plainToInstance(CreateUserDto, {
      id: user.id,
      name: user.name,
      email: user.email,
      is_guide_complete: user.is_guide_complete,
      picture: user.picture,
    } satisfies CreateUserDto)
  }
}
