import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IKurinRepository, KurinStats, KurinDetails, ForemanWithStats } from "~modules/kurins/domain/repositories/kurin.repository.interface"
import { KurinSchema } from "~shared/infrastructure/database/postgres/schemas/kurin.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { GroupSchema } from "~shared/infrastructure/database/postgres/schemas/group.schema"
import { GroupMembershipSchema } from "~shared/infrastructure/database/postgres/schemas/group-membership.schema"
import { RoleSchema } from "~shared/infrastructure/database/postgres/schemas/role.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"

@Injectable()
export class KurinRepository implements IKurinRepository {
  constructor(
    @InjectRepository(KurinSchema)
    private readonly kurinRepository: Repository<KurinSchema>,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
    @InjectRepository(GroupSchema)
    private readonly groupRepository: Repository<GroupSchema>,
    @InjectRepository(GroupMembershipSchema)
    private readonly membershipRepository: Repository<GroupMembershipSchema>,
    @InjectRepository(RoleSchema)
    private readonly roleRepository: Repository<RoleSchema>,
    @InjectRepository(UserProbaProgressSchema)
    private readonly progressRepository: Repository<UserProbaProgressSchema>
  ) {}

  async findAll(): Promise<KurinSchema[]> {
    return this.kurinRepository.find({
      relations: ["liaison", "members"],
    })
  }

  async findAllWithStats(): Promise<KurinStats[]> {
    const kurins = await this.kurinRepository.find({
      relations: ["liaison"],
    })

    const stats: KurinStats[] = []

    for (const kurin of kurins) {
      const foremanCount = await this.userRepository
        .createQueryBuilder("user")
        .innerJoin("user.role", "role")
        .where("user.kurin_id = :kurinId", { kurinId: kurin.id })
        .andWhere("role.name = :roleName", { roleName: "FOREMAN" })
        .getCount()

      const groupCount = await this.groupRepository
        .createQueryBuilder("group")
        .innerJoin("group.owner", "owner")
        .where("owner.kurin_id = :kurinId", { kurinId: kurin.id })
        .getCount()

      const scoutCount = await this.membershipRepository
        .createQueryBuilder("membership")
        .innerJoin("membership.user", "user")
        .innerJoin("user.role", "role")
        .innerJoin("membership.group", "group")
        .innerJoin("group.owner", "owner")
        .where("owner.kurin_id = :kurinId", { kurinId: kurin.id })
        .andWhere("role.name = :roleName", { roleName: "SCOUT" })
        .getCount()

      stats.push({
        id: kurin.id,
        name: kurin.name,
        liaison: kurin.liaison ? {
          id: kurin.liaison.id,
          name: kurin.liaison.name,
          email: kurin.liaison.email,
        } : undefined,
        foremanCount,
        groupCount,
        scoutCount,
      })
    }

    return stats
  }

  async findById(id: string): Promise<KurinSchema | null> {
    return this.kurinRepository.findOne({
      where: { id },
      relations: ["liaison", "members"],
    })
  }

  async findByIdWithForemen(id: string): Promise<KurinDetails | null> {
    const kurin = await this.kurinRepository.findOne({
      where: { id },
      relations: ["liaison"],
    })

    if (!kurin) {
      return null
    }

    const foremenSchemas = await this.userRepository.find({
      where: {
        kurin: { id: kurin.id },
        role: { name: "FOREMAN" }
      },
      relations: ["role"],
    })

    const foremen: ForemanWithStats[] = []

    for (const foreman of foremenSchemas) {
      const groupCount = await this.groupRepository
        .createQueryBuilder("group")
        .where("group.owner_id = :foremanId", { foremanId: foreman.id })
        .getCount()

      const scoutCount = await this.membershipRepository
        .createQueryBuilder("membership")
        .innerJoin("membership.group", "group")
        .innerJoin("membership.user", "user")
        .innerJoin("user.role", "role")
        .where("group.owner_id = :foremanId", { foremanId: foreman.id })
        .andWhere("role.name = :roleName", { roleName: "SCOUT" })
        .getCount()

      const scoutIds = await this.membershipRepository
        .createQueryBuilder("membership")
        .select("membership.user_id", "userId")
        .innerJoin("membership.group", "group")
        .innerJoin("membership.user", "user")
        .innerJoin("user.role", "role")
        .where("group.owner_id = :foremanId", { foremanId: foreman.id })
        .andWhere("role.name = :roleName", { roleName: "SCOUT" })
        .getRawMany()

      let averageProgress = 0
      if (scoutIds.length > 0) {
        const scoutIdsList = scoutIds.map(s => s.userId)

        const progressData = await this.progressRepository
          .createQueryBuilder("progress")
          .select("progress.user_id", "userId")
          .addSelect("COUNT(*)", "totalItems")
          .addSelect("SUM(CASE WHEN progress.is_completed = true THEN 1 ELSE 0 END)", "completedItems")
          .where("progress.user_id IN (:...scoutIds)", { scoutIds: scoutIdsList })
          .groupBy("progress.user_id")
          .getRawMany()

        if (progressData.length > 0) {
          const totalProgress = progressData.reduce((sum, scout) => {
            const scoutProgress = (Number(scout.completedItems) / Number(scout.totalItems)) * 100
            return sum + scoutProgress
          }, 0)
          averageProgress = Math.round(totalProgress / progressData.length)
        }
      }

      foremen.push({
        id: foreman.id,
        name: foreman.name,
        email: foreman.email,
        groupCount,
        scoutCount,
        averageProgress,
      })
    }

    return {
      id: kurin.id,
      name: kurin.name,
      liaison: kurin.liaison ? {
        id: kurin.liaison.id,
        name: kurin.liaison.name,
        email: kurin.liaison.email,
      } : undefined,
      foremen,
    }
  }

  async create(name: string, liaison?: UserSchema): Promise<KurinSchema> {
    const kurin = this.kurinRepository.create({ name, liaison })
    return this.kurinRepository.save(kurin)
  }

  async update(id: string, data: { name?: string; liaison?: UserSchema }): Promise<KurinSchema> {
    await this.kurinRepository.update({ id }, data)
    return this.findById(id) as Promise<KurinSchema>
  }

  async delete(id: string): Promise<void> {
    await this.kurinRepository.delete({ id })
  }
}
