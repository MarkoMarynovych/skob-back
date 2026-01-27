import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { IProbaRepository, ProbaDITokens } from "~modules/proba/domain/repositories/proba.repository.interface"
import { IRoleRepository, RoleDITokens } from "~modules/roles/domain/repositories/role.repository.interface"
import { Role } from "~modules/users/application/enums/role.enum"
import { User } from "~modules/users/domain/entities/user.entity"
import { IUserRepository, ForemanDetails, GroupWithStats } from "~modules/users/domain/repositories/user.repository.interface"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
import { GroupSchema } from "~shared/infrastructure/database/postgres/schemas/group.schema"
import { GroupMembershipSchema } from "~shared/infrastructure/database/postgres/schemas/group-membership.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name)

  constructor(
    @InjectRepository(UserSchema)
    private readonly usersRepository: Repository<UserSchema>,
    @InjectRepository(GroupSchema)
    private readonly groupRepository: Repository<GroupSchema>,
    @InjectRepository(GroupMembershipSchema)
    private readonly membershipRepository: Repository<GroupMembershipSchema>,
    @InjectRepository(UserProbaProgressSchema)
    private readonly progressRepository: Repository<UserProbaProgressSchema>,
    private readonly dataSource: DataSource,
    @Inject(ProbaDITokens.PROBA_REPOSITORY)
    private readonly probaRepository: IProbaRepository,
    @Inject(RoleDITokens.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userSchema = await this.usersRepository.findOne({
      where: { email },
      relations: {
        role: true, // Explicitly load the role relation
        kurin: true, // Load the kurin relation
        memberships: {
          group: true,
        },
      },
    })

    if (!userSchema) {
      return null
    }

    if (!userSchema.role) {
      this.logger.error(`FATAL: User ${email} exists but their role relationship is broken or the role_id is null in the database.`)
      throw new Error(`User ${email} has no role assigned.`)
    }

    return {
      id: userSchema.id,
      name: userSchema.name,
      email: userSchema.email,
      sex: userSchema.sex,
      is_guide_complete: userSchema.is_guide_complete,
      picture: userSchema.picture,
      role: userSchema.role.name as Role, // We now know userSchema.role exists
      kurin: userSchema.kurin
        ? {
            id: userSchema.kurin.id,
            name: userSchema.kurin.name,
          }
        : undefined,
    }
  }

  async findById(id: string): Promise<User | null> {
    const userSchema = await this.usersRepository.findOne({
      where: { id },
      relations: {
        role: true,
        kurin: true,
        memberships: {
          group: true,
        },
      },
    })

    if (!userSchema) {
      return null
    }

    if (!userSchema.role) {
      this.logger.error(`FATAL: User with ID ${id} exists but their role relationship is broken or the role_id is null in the database.`)
      throw new Error(`User with ID ${id} has no role assigned.`)
    }

    return {
      id: userSchema.id,
      name: userSchema.name,
      email: userSchema.email,
      sex: userSchema.sex,
      is_guide_complete: userSchema.is_guide_complete,
      picture: userSchema.picture,
      role: userSchema.role.name as Role,
      kurin: userSchema.kurin
        ? {
            id: userSchema.kurin.id,
            name: userSchema.kurin.name,
          }
        : undefined,
    }
  }

  async findByRole(role: Role): Promise<User[]> {
    const userSchemas = await this.usersRepository.find({
      where: { role: { name: role } },
      relations: { role: true, kurin: true },
    })

    return userSchemas.map((userSchema) => ({
      id: userSchema.id,
      name: userSchema.name,
      email: userSchema.email,
      sex: userSchema.sex,
      is_guide_complete: userSchema.is_guide_complete,
      picture: userSchema.picture,
      role: userSchema.role?.name as Role,
    }))
  }

  async findLiaisonsWithStats(): Promise<import("~modules/users/domain/repositories/user.repository.interface").LiaisonStats[]> {
    const liaisons = await this.usersRepository.find({
      where: { role: { name: Role.LIAISON } },
      relations: { role: true, kurin: true },
    })

    const stats: import("~modules/users/domain/repositories/user.repository.interface").LiaisonStats[] = []

    for (const liaison of liaisons) {
      if (!liaison.kurin) {
        stats.push({
          id: liaison.id,
          name: liaison.name,
          email: liaison.email,
          picture: liaison.picture,
          foremanCount: 0,
          totalScouts: 0,
        })
        continue
      }

      const foremanCount = await this.usersRepository
        .createQueryBuilder("user")
        .innerJoin("user.role", "role")
        .where("user.kurin_id = :kurinId", { kurinId: liaison.kurin.id })
        .andWhere("role.name = :roleName", { roleName: "FOREMAN" })
        .getCount()

      const totalScouts = await this.membershipRepository
        .createQueryBuilder("membership")
        .innerJoin("membership.user", "user")
        .innerJoin("user.role", "role")
        .innerJoin("membership.group", "group")
        .innerJoin("group.owner", "owner")
        .where("owner.kurin_id = :kurinId", { kurinId: liaison.kurin.id })
        .andWhere("role.name = :roleName", { roleName: "SCOUT" })
        .getCount()

      stats.push({
        id: liaison.id,
        name: liaison.name,
        email: liaison.email,
        picture: liaison.picture,
        foremanCount,
        totalScouts,
      })
    }

    return stats
  }

  async create(data: Partial<UserSchema>): Promise<User> {
    const scoutRole = await this.roleRepository.findByName(Role.SCOUT)
    if (!scoutRole) {
      throw new Error("Default SCOUT role not found. Please seed the database.")
    }

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const user = this.usersRepository.create({ ...data, role: scoutRole })
      const savedUser = await queryRunner.manager.save(UserSchema, user)

      // Only initialize probas if user has gender set
      if (savedUser.sex) {
        await this.probaRepository.initializeUserProbas(savedUser.id, savedUser.sex)
      }

      await queryRunner.commitTransaction()
      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        sex: savedUser.sex,
        is_guide_complete: savedUser.is_guide_complete,
        picture: savedUser.picture,
        role: scoutRole.name as Role,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async save(user: Partial<User>): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Get the role if it's provided
      let roleSchema = undefined
      if (user.role) {
        roleSchema = await this.roleRepository.findByName(user.role)
        if (!roleSchema) {
          throw new Error(`Role ${user.role} not found`)
        }
      }

      // Create the user schema object
      const userSchema = this.usersRepository.create({
        name: user.name,
        email: user.email,
        sex: user.sex,
        picture: user.picture,
        is_guide_complete: user.is_guide_complete,
        role: roleSchema,
      })

      const savedUser = await queryRunner.manager.save(UserSchema, userSchema)

      // Only initialize probas if user has gender set
      if (savedUser.sex) {
        await this.probaRepository.initializeUserProbas(savedUser.id, savedUser.sex)
      }

      await queryRunner.commitTransaction()
      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        sex: savedUser.sex,
        is_guide_complete: savedUser.is_guide_complete,
        picture: savedUser.picture,
        role: savedUser.role?.name as Role,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findForemanWithGroups(foremanId: string): Promise<ForemanDetails | null> {
    const foreman = await this.usersRepository.findOne({
      where: { id: foremanId },
      relations: ["role"],
    })

    if (!foreman) {
      return null
    }

    const groupSchemas = await this.groupRepository.find({
      where: { owner: { id: foremanId } },
      relations: ["owner"],
    })

    const groups: GroupWithStats[] = []

    for (const group of groupSchemas) {
      const scoutCount = await this.membershipRepository
        .createQueryBuilder("membership")
        .innerJoin("membership.user", "user")
        .innerJoin("user.role", "role")
        .where("membership.group_id = :groupId", { groupId: group.id })
        .andWhere("role.name = :roleName", { roleName: "SCOUT" })
        .getCount()

      const scoutIds = await this.membershipRepository
        .createQueryBuilder("membership")
        .select("membership.user_id", "userId")
        .innerJoin("membership.user", "user")
        .innerJoin("user.role", "role")
        .where("membership.group_id = :groupId", { groupId: group.id })
        .andWhere("role.name = :roleName", { roleName: "SCOUT" })
        .getRawMany()

      let averageProgress = 0
      if (scoutIds.length > 0) {
        const scoutIdsList = scoutIds.map((s) => s.userId)

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

      groups.push({
        id: group.id,
        name: group.name,
        scoutCount,
        averageProgress,
      })
    }

    return {
      id: foreman.id,
      name: foreman.name,
      email: foreman.email,
      groups,
    }
  }

  async update(email: string, userData: Partial<User>): Promise<User> {
    const userSchema = await this.usersRepository.findOne({
      where: { email },
      relations: ["role", "memberships"],
    })

    if (!userSchema) {
      throw new NotFoundException("User not found")
    }

    // If updating role, fetch the RoleSchema
    if (userData.role) {
      const roleSchema = await this.roleRepository.findByName(userData.role)
      if (!roleSchema) {
        throw new NotFoundException(`Role ${userData.role} not found`)
      }
      userSchema.role = roleSchema
    }

    // Update other fields
    if (userData.name !== undefined) userSchema.name = userData.name
    if (userData.email !== undefined) userSchema.email = userData.email
    if (userData.sex !== undefined) userSchema.sex = userData.sex
    if (userData.picture !== undefined) userSchema.picture = userData.picture
    if (userData.is_guide_complete !== undefined) userSchema.is_guide_complete = userData.is_guide_complete

    const updatedUser = await this.usersRepository.save(userSchema)

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      sex: updatedUser.sex,
      picture: updatedUser.picture,
      is_guide_complete: updatedUser.is_guide_complete,
      role: updatedUser.role.name as Role,
    }
  }
}
