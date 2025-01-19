import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProbaProgressMapper } from "~modules/proba/domain/mappers/proba-progress.mapper"
import { ProbaItemSchema } from "~shared/infrastructure/database/postgres/schemas/proba-item.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { IProbaRepository } from "../../domain/repositories/proba.repository.interface"
import { OrganizedProbaProgress, OrganizedProbaProgressView } from "../../domain/types/organized-proba-progress.type"

@Injectable()
export class ProbaRepository implements IProbaRepository {
  constructor(
    @InjectRepository(ProbaItemSchema)
    private itemRepo: Repository<ProbaItemSchema>,
    @InjectRepository(UserProbaProgressSchema)
    private progressRepo: Repository<UserProbaProgressSchema>
  ) {}

  async initializeUserProbas(userId: string): Promise<void> {
    const allItems = await this.itemRepo.find({
      relations: {
        template: true,
      },
      order: {
        template: {
          order: "ASC",
        },
        order: "ASC",
      },
    })

    console.log("Found items to initialize:", allItems.length)

    const progressEntries = allItems.map((probaItem) => ({
      user: { id: userId },
      proba_item: { id: probaItem.id },
      is_completed: false,
    }))

    console.log("Created progress entries:", progressEntries.length)
    const saved = await this.progressRepo.save(progressEntries)
    console.log("Saved progress entries:", saved.length)
  }

  async getUserProbaProgress(userId: string): Promise<OrganizedProbaProgress> {
    const progress = await this.progressRepo.find({
      where: {
        user: { id: userId },
      },
      relations: {
        proba_item: {
          template: true,
        },
        user: true,
      },
      order: {
        proba_item: {
          template: {
            order: "ASC",
            name: "ASC",
          },
          order: "ASC",
        },
      },
    })

    if (!progress.length) {
      return {
        userId,
        userName: "",
        userEmail: "",
        zeroProba: {},
        firstProba: {},
        secondProba: {},
      }
    }

    return ProbaProgressMapper.toOrganized(progress, userId)
  }

  async getUserProbaProgressView(userId: string): Promise<OrganizedProbaProgressView> {
    const progress = await this.getUserProbaProgress(userId)
    return ProbaProgressMapper.toView(progress)
  }

  async signProbaItem(userId: string, itemId: string, foremanId: string, status: boolean): Promise<void> {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
    })
    console.log("Found proba item:", item)

    const progress = await this.progressRepo.findOne({
      where: {
        user: { id: userId },
        proba_item: { id: itemId },
      },
      relations: {
        proba_item: true,
        user: true,
      },
    })

    if (!progress) {
      const allProgress = await this.progressRepo.find({
        where: { user: { id: userId } },
        take: 1,
      })
      console.log("User has any progress:", allProgress.length > 0)

      throw new NotFoundException("User proba progress not found")
    }

    await this.progressRepo.save({
      ...progress,
      is_completed: status,
      completed_at: new Date(),
      signed_by: { id: foremanId },
    })
  }
}
