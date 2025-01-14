import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IInvitesRepository } from "~modules/invites/domain/repositories/invites.repository.interface"
import { InviteSchema } from "~shared/infrastructure/database/postgres/schemas/invite.schema"

@Injectable()
export class InvitesRepository implements IInvitesRepository {
  constructor(
    @InjectRepository(InviteSchema)
    private readonly invitesRepository: Repository<InviteSchema>
  ) {}
  async findOne(hash: string): Promise<InviteSchema | null> {
    const invite = await this.invitesRepository.findOne({
      where: { hash: hash },
      relations: {
        scout: true,
        foreman: true,
      },
    })
    return invite
  }

  public async save(invite: Partial<InviteSchema>): Promise<InviteSchema> {
    return this.invitesRepository.save(invite)
  }
}
