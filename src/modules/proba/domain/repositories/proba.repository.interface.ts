import { OrganizedProbaProgress, OrganizedProbaProgressView } from "../types/organized-proba-progress.type"

export interface IProbaRepository {
  initializeUserProbas(userId: string): Promise<void>
  getUserProbaProgress(userId: string): Promise<OrganizedProbaProgress>
  getUserProbaProgressView(userId: string): Promise<OrganizedProbaProgressView>
  signProbaItem(userId: string, itemId: string, foremanId: string, status: boolean): Promise<void>
}

export enum ProbaDITokens {
  PROBA_REPOSITORY = "PROBA_REPOSITORY",
  SIGN_ENTIRE_PROBA_USE_CASE = "SIGN_ENTIRE_PROBA_USE_CASE",
  UPDATE_PROBA_USE_CASE = "UPDATE_PROBA_USE_CASE",
}
