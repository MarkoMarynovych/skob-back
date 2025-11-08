import { User } from "~modules/users/domain/entities/user.entity"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

export class UserMapper {
  public static toSchema(user: User): UserSchema {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      sex: user.sex,
      is_guide_complete: user.is_guide_complete,
      picture: user.picture,
      created_at: new Date(),
      update_at: new Date(),
    } as UserSchema
  }
}
