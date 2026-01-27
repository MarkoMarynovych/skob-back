import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProbaProgressMapper } from "~modules/proba/domain/mappers/proba-progress.mapper"
import { ProbaItemTemplateSchema } from "~shared/infrastructure/database/postgres/schemas/proba-item-template.schema"
import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { IProbaRepository } from "../../domain/repositories/proba.repository.interface"
import { OrganizedProbaProgress, OrganizedProbaProgressView } from "../../domain/types/organized-proba-progress.type"

@Injectable()
export class ProbaRepository implements IProbaRepository {
  private readonly logger = new Logger(ProbaRepository.name)

  constructor(
    @InjectRepository(ProbaItemTemplateSchema)
    private itemRepo: Repository<ProbaItemTemplateSchema>,
    @InjectRepository(UserProbaProgressSchema)
    private progressRepo: Repository<UserProbaProgressSchema>
  ) {}

  async initializeUserProbas(userId: string, gender: "MALE" | "FEMALE"): Promise<void> {
    this.logger.log(`[ProbaRepository] initializeUserProbas called with userId: ${userId}, gender: ${gender}`)

    // Step 1: Find all template items that apply to this user's gender
    // This includes gender-specific templates and neutral ones.
    this.logger.log(`[ProbaRepository] Querying for items with gender: ${gender} or NEUTRAL`)
    const applicableItems = await this.itemRepo.find({
      relations: {
        section: {
          template: true,
        },
      },
      where: [{ section: { template: { gender_variant: gender } } }, { section: { template: { gender_variant: "NEUTRAL" } } }],
    })

    this.logger.log(`[ProbaRepository] Found ${applicableItems.length} applicable items`)

    if (applicableItems.length === 0) {
      // This is a critical error if templates are not seeded.
      // We can log this, but we won't throw to not break the user flow.
      this.logger.warn(`No proba items found for gender ${gender}. Database may need seeding.`)
      return
    }

    // Step 2: Create a progress record for EACH item found.
    this.logger.log(`[ProbaRepository] Creating progress entries for ${applicableItems.length} items`)
    const progressEntries = applicableItems.map((item) => {
      return this.progressRepo.create({
        user: { id: userId },
        proba_item: { id: item.id },
        is_completed: false,
      })
    })

    // Step 3: Save all new progress records in a single transaction.
    // Using save on an array of entities is transactional by default.
    this.logger.log(`[ProbaRepository] Saving ${progressEntries.length} progress entries`)
    await this.progressRepo.save(progressEntries)
    this.logger.log(`Initialized ${progressEntries.length} proba items for user ${userId}.`)
  }

  async getUserProbaProgress(userId: string): Promise<OrganizedProbaProgress> {
    this.logger.log(`[ProbaRepository] getUserProbaProgress called for userId: ${userId}`)

    const progress = await this.progressRepo.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
        signed_by: true,
        proba_item: {
          section: {
            template: true,
          },
        },
        notes: {
          createdBy: true,
        },
      },
      order: {
        proba_item: {
          section: {
            template: {
              level: "ASC",
            },
            order: "ASC",
          },
          order: "ASC",
        },
      },
    })

    this.logger.log(`[ProbaRepository] Found ${progress.length} progress items for user ${userId} before mapping`)

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
