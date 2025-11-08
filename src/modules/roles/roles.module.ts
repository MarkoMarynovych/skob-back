import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"
import { RoleDITokens } from "./domain/repositories/role.repository.interface"
import { RoleRepository } from "./infrastructure/repositories/role.repository"

@Module({
  imports: [TypeOrmModule.forFeature([RoleSchema])],
  providers: [
    {
      provide: RoleDITokens.ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
  ],
  exports: [RoleDITokens.ROLE_REPOSITORY],
})
export class RolesModule {}
