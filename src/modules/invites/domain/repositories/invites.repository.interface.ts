import { InviteSchema } from "~shared/infrastructure/database/postgres/schemas/invite.schema"

export interface IInvitesRepository {
  save(invite: Partial<InviteSchema>): Promise<InviteSchema>
  findOne(hash: string): Promise<InviteSchema | null>
}
