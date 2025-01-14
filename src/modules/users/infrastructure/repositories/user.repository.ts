import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, Repository } from "typeorm"
import { User } from "~modules/users/domain/entities/user.entity"
import { IUserRepository } from "~modules/users/domain/repositories/user.repository.interface"
import { ScoutsForemansSchema } from "~shared/infrastructure/database/postgres/schemas/scouts-foremans.schema"
import { UserSchema } from "~shared/infrastructure/database/postgres/schemas/user.schema"
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly usersRepository: Repository<UserSchema>,
    private readonly dataSource: DataSource
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userSchema = await this.usersRepository.findOne({
      where: { email },
      relations: ["foremans.foreman", "scouts.scout"],
    })

    if (!userSchema) return null

    return {
      id: userSchema.id,
      name: userSchema.name,
      email: userSchema.email,
      sex: userSchema.sex,
      is_guide_complete: userSchema.is_guide_complete,
      picture: userSchema.picture,
      scouts:
        userSchema.scouts?.map((s) => ({
          id: s.scout.id,
          name: s.scout.name,
          email: s.scout.email,
          sex: s.scout.sex,
          is_guide_complete: s.scout.is_guide_complete,
          picture: s.scout.picture,
        })) ?? [],
      foremans:
        userSchema.foremans?.map((f) => ({
          id: f.foreman.id,
          name: f.foreman.name,
          email: f.foreman.email,
          sex: f.foreman.sex,
          is_guide_complete: f.foreman.is_guide_complete,
          picture: f.foreman.picture,
        })) ?? [],
    }
  }

  async save(user: Partial<User>): Promise<User> {
    const savedUser = await this.usersRepository.save(user)
    return savedUser
  }

  async update(email: string, userData: Partial<User>): Promise<User> {
    const user = await this.findByEmail(email)

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...userData,
    })

    return updatedUser
  }

  async findScoutsByForemanEmail(foremanEmail: string): Promise<User[]> {
    const foreman = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.foremans", "scoutForeman")
      .leftJoinAndSelect("scoutForeman.scout", "scout")
      .where("user.email = :email", { email: foremanEmail })
      .getOne()

    if (!foreman) {
      throw new NotFoundException(`Foreman with email ${foremanEmail} not found`)
    }

    return foreman.foremans.map((sf) => ({
      id: sf.scout.id,
      name: sf.scout.name,
      email: sf.scout.email,
      sex: sf.scout.sex,
      is_guide_complete: sf.scout.is_guide_complete,
      picture: sf.scout.picture,
    }))
  }

  async isUserForeman(foremanEmail: string, scoutEmail: string): Promise<boolean> {
    const foreman = await this.usersRepository.findOne({ where: { email: foremanEmail } })
    const scout = await this.usersRepository.findOne({ where: { email: scoutEmail } })

    if (!foreman || !scout) {
      return false
    }

    const result = await this.usersRepository
      .createQueryBuilder("user")
      .innerJoin("user.foremans", "scoutForeman")
      .innerJoin("scoutForeman.scout", "scout")
      .where("user.id = :foremanId", { foremanId: foreman.id })
      .andWhere("scout.id = :scoutId", { scoutId: scout.id })
      .getOne()

    return !!result
  }

  async removeScoutFromForeman(scoutEmail: string, foremanEmail: string): Promise<void> {
    const isForeman = await this.isUserForeman(foremanEmail, scoutEmail)

    if (!isForeman) {
      throw new ForbiddenException(`User ${foremanEmail} is not a foreman for ${scoutEmail}`)
    }

    const foreman = await this.usersRepository.findOne({ where: { email: foremanEmail } })
    const scout = await this.usersRepository.findOne({ where: { email: scoutEmail } })

    if (!foreman || !scout) {
      throw new NotFoundException("Scout or foreman not found")
    }

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from("scouts_foremans")
      .where("foreman_id = :foremanId", { foremanId: foreman.id })
      .andWhere("user_id = :scoutId", { scoutId: scout.id })
      .execute()
  }

  async validateUserUpdatePermission(userEmailToUpdate: string, requestUserEmail: string): Promise<void> {
    const isSelfRequest = requestUserEmail === userEmailToUpdate
    console.log("isSelfRequest", isSelfRequest)
    if (isSelfRequest) {
      return
    }

    const isForeman = await this.isUserForeman(requestUserEmail, userEmailToUpdate)

    if (!isForeman) {
      throw new ForbiddenException(`You haven't permission to update ${userEmailToUpdate} profile`)
    }
  }

  async isUserForemanById(foremanId: string, scoutId: string): Promise<boolean> {
    const result = await this.usersRepository
      .createQueryBuilder("user")
      .innerJoin("user.foremans", "scoutForeman")
      .innerJoin("scoutForeman.scout", "scout")
      .where("user.id = :foremanId", { foremanId })
      .andWhere("scout.id = :scoutId", { scoutId })
      .getOne()

    return !!result
  }

  async addUserToGroup(scoutId: string, foremanId: string): Promise<void> {
    const scout = await this.usersRepository.findOne({ where: { id: scoutId } })
    const foreman = await this.usersRepository.findOne({ where: { id: foremanId } })

    console.log("Adding to group:", { scoutId, foremanId, scout, foreman })

    if (!scout || !foreman) {
      throw new NotFoundException("Scout or foreman not found")
    }

    const isAlreadyInGroup = await this.isUserForemanById(foremanId, scoutId)
    if (isAlreadyInGroup) {
      throw new ForbiddenException(`User ${scoutId} is already in ${foremanId}'s group`)
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(ScoutsForemansSchema)
      .values([
        {
          scout: scout,
          foreman: foreman,
        },
      ])
      .execute()

    console.log("Insert result:", result)
  }
}
