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
      const template = item.proba_item.template
      const section = template.section

      let targetProba: keyof OrganizedProbaProgress
      if (template.name.includes("Прихильник")) {
        targetProba = "zeroProba"
      } else if (template.name.includes("Перша")) {
        targetProba = "firstProba"
      } else {
        targetProba = "secondProba"
      }

      if (!result[targetProba][section]) {
        result[targetProba][section] = []
      }

      result[targetProba][section][item.proba_item.order - 1] = {
        is_completed: item.is_completed,
        proba_item: { id: item.proba_item.id },
      }
    })

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
