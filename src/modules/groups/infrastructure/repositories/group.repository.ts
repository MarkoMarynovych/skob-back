import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IGroupRepository, GroupDetails, ScoutWithProgress } from "~modules/groups/domain/repositories/group.repository.interface"
import { GroupSchema } from "~shared/infrastructure/database/postgres/schemas/group.schema"
import { GroupMembershipSchema } from "~shared/infrastructure/database/postgres/schemas/group-membership.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(
    @InjectRepository(GroupSchema)
    private readonly groupRepository: Repository<GroupSchema>,
    @InjectRepository(GroupMembershipSchema)
    private readonly membershipRepository: Repository<GroupMembershipSchema>,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
    @InjectRepository(UserProbaProgressSchema)
    private readonly progressRepository: Repository<UserProbaProgressSchema>
  ) {}

  async findByOwnerId(ownerId: string): Promise<GroupSchema[]> {
    return this.groupRepository.find({
      where: { owner: { id: ownerId } },
      relations: ["owner", "memberships", "memberships.user"],
    })
  }

  async findByMemberId(memberId: string): Promise<GroupSchema[]> {
    const memberships = await this.membershipRepository.find({
      where: { user: { id: memberId } },
      relations: ["group", "group.owner", "group.memberships", "group.memberships.user"],
    })

    return memberships.map((membership) => membership.group)
  }

  async findById(groupId: string): Promise<GroupSchema | null> {
    return this.groupRepository.findOne({
      where: { id: groupId },
      relations: ["owner", "memberships", "memberships.user"],
    })
  }

  async findByIdWithScouts(groupId: string): Promise<GroupDetails | null> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    })

    if (!group) {
      return null
    }

    const memberships = await this.membershipRepository.find({
      where: { group: { id: groupId } },
      relations: ["user", "user.role"],
    })

    const scouts: ScoutWithProgress[] = []

    for (const membership of memberships) {
      if (!membership.user) {
        continue
      }

      if (membership.user.role?.name === "SCOUT") {
        const progressData = await this.progressRepository
          .createQueryBuilder("progress")
          .select("COUNT(*)", "totalItems")
          .addSelect("SUM(CASE WHEN progress.is_completed = true THEN 1 ELSE 0 END)", "completedItems")
          .where("progress.user_id = :userId", { userId: membership.user.id })
          .getRawOne()

        scouts.push({
          id: membership.user.id,
          name: membership.user.name,
          email: membership.user.email,
          completedItems: Number(progressData?.completedItems || 0),
          totalItems: Number(progressData?.totalItems || 0),
        })
      }
    }

    return {
      id: group.id,
      name: group.name,
      scouts,
    }
  }

  async findByInviteToken(inviteToken: string): Promise<GroupSchema | null> {
    return this.groupRepository.findOne({
      where: { inviteToken },
      relations: ["owner", "memberships", "memberships.user"],
    })
  }

  async create(name: string, owner: UserSchema, inviteToken: string): Promise<GroupSchema> {
    const group = this.groupRepository.create({ name, owner, inviteToken })
    return this.groupRepository.save(group)
  }

  async update(groupId: string, data: { name?: string }): Promise<void> {
    await this.groupRepository.update({ id: groupId }, data)
  }

  async addMember(groupId: string, userId: string): Promise<GroupMembershipSchema> {
    const group = await this.findById(groupId)
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`)
    }

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`)
    }

    const membership = this.membershipRepository.create({ group, user })
    return this.membershipRepository.save(membership)
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    await this.membershipRepository.delete({
      group: { id: groupId },
      user: { id: userId },
    })
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const membership = await this.membershipRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
      },
    })
    return !!membership
  }

  async isOwnerOfUserGroup(ownerId: string, userId: string): Promise<boolean> {
    const membership = await this.membershipRepository.findOne({
      where: {
        user: { id: userId },
        group: { owner: { id: ownerId } },
      },
      relations: ["group", "group.owner"],
    })
    return !!membership
  }
}
