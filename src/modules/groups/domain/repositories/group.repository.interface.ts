import { GroupSchema } from "~shared/infrastructure/database/postgres/schemas/group.schema"
import { GroupMembershipSchema } from "~shared/infrastructure/database/postgres/schemas/group-membership.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"

export interface ScoutWithProgress {
  id: string
  name: string
  email: string
  completedItems: number
  totalItems: number
}

export interface GroupDetails {
  id: string
  name: string
  scouts: ScoutWithProgress[]
}

export interface IGroupRepository {
  findByOwnerId(ownerId: string): Promise<GroupSchema[]>
  findByMemberId(memberId: string): Promise<GroupSchema[]>
  findById(groupId: string): Promise<GroupSchema | null>
  findByIdWithScouts(groupId: string): Promise<GroupDetails | null>
  findByInviteToken(inviteToken: string): Promise<GroupSchema | null>
  create(name: string, owner: UserSchema, inviteToken: string): Promise<GroupSchema>
  update(groupId: string, data: { name?: string }): Promise<void>
  addMember(groupId: string, userId: string): Promise<GroupMembershipSchema>
  removeMember(groupId: string, userId: string): Promise<void>
  isMember(groupId: string, userId: string): Promise<boolean>
  isOwnerOfUserGroup(ownerId: string, userId: string): Promise<boolean>
}

export const GroupDITokens = {
  GROUP_REPOSITORY: Symbol("GROUP_REPOSITORY"),
}
