import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IRoleRepository } from "~modules/roles/domain/repositories/role.repository.interface"
import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleSchema)
    private readonly repository: Repository<RoleSchema>
  ) {}

  async findByName(name: string): Promise<RoleSchema | null> {
    return this.repository.findOneBy({ name })
  }
}
