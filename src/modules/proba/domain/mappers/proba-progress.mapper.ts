import { UserProbaProgressSchema } from "~shared/infrastructure/database/postgres/schemas/user-proba-progress.schema"
import { OrganizedProbaProgress, OrganizedProbaProgressView } from "../types/organized-proba-progress.type"

export class ProbaProgressMapper {
  public static toOrganized(progress: UserProbaProgressSchema[], userId: string): OrganizedProbaProgress {
    const result: OrganizedProbaProgress = {
      userId,
      userEmail: progress[0]?.user?.email || "",
      userName: progress[0]?.user?.name || "",
      zeroProba: {},
      firstProba: {},
      secondProba: {},
    }

    progress.forEach((item) => {
      // Null safety: Skip items with incomplete data
      if (!item.proba_item?.section?.template) {
        console.warn(`[ProbaProgressMapper] Skipping item with incomplete relations: ${item.id}`)
        return
      }

      const section = item.proba_item.section
      const template = section.template
      const sectionTitle = section.title

      // Use template.level instead of template.name for more reliable categorization
      let targetProba: keyof OrganizedProbaProgress
      if (template.level === 0) {
        targetProba = "zeroProba"
      } else if (template.level === 1) {
        targetProba = "firstProba"
      } else {
        targetProba = "secondProba"
      }

      if (!result[targetProba][sectionTitle]) {
        result[targetProba][sectionTitle] = []
      }

      result[targetProba][sectionTitle][item.proba_item.order] = {
        progress_id: item.id,
        is_completed: item.is_completed,
        proba_item: {
          id: item.proba_item.id,
          text: item.proba_item.text,
          order: item.proba_item.order,
        },
        completed_at: item.completed_at,
        signed_by: item.signed_by
          ? {
              id: item.signed_by.id,
              name: item.signed_by.name,
              email: item.signed_by.email,
            }
          : undefined,
        notes:
          item.notes?.map((note) => ({
            id: note.id,
            content: note.content,
            createdAt: note.created_at,
            createdBy: {
              id: note.createdBy.id,
              name: note.createdBy.name,
              email: note.createdBy.email,
            },
          })) || [],
      }
    })

    console.log(
      `[ProbaProgressMapper] Final mapped object: ${Object.keys(result.zeroProba).length} zeroProba sections, ${Object.keys(result.firstProba).length} firstProba sections, ${Object.keys(result.secondProba).length} secondProba sections`
    )

    return result
  }

  public static toView(progress: OrganizedProbaProgress): OrganizedProbaProgressView {
    return {
      userId: progress.userId,
      userName: progress.userName,
      userEmail: progress.userEmail,
      zeroProba: Object.fromEntries(Object.entries(progress.zeroProba).map(([section, items]) => [section, items.map((item) => (item.is_completed ? 1 : 0))])),
      firstProba: Object.fromEntries(Object.entries(progress.firstProba).map(([section, items]) => [section, items.map((item) => (item.is_completed ? 1 : 0))])),
      secondProba: Object.fromEntries(Object.entries(progress.secondProba).map(([section, items]) => [section, items.map((item) => (item.is_completed ? 1 : 0))])),
    }
  }
}
