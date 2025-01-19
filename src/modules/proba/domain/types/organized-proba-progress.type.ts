export interface ProbaProgressItem {
  is_completed: boolean
  proba_item: { id: string }
}

export interface OrganizedProbaProgress {
  userId: string
  userName: string
  userEmail: string
  zeroProba: { [section: string]: ProbaProgressItem[] }
  firstProba: { [section: string]: ProbaProgressItem[] }
  secondProba: { [section: string]: ProbaProgressItem[] }
}

export interface OrganizedProbaProgressView {
  userId: string
  userName: string
  userEmail: string
  zeroProba: { [section: string]: number[] }
  firstProba: { [section: string]: number[] }
  secondProba: { [section: string]: number[] }
}
