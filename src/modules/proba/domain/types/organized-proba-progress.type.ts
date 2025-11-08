export interface ProbaProgressItem {
  progress_id: string
  is_completed: boolean
  proba_item: { id: string; text: string; order: number }
  completed_at?: Date
  signed_by?: { id: string; name: string; email: string }
  notes?: Array<{
    id: string
    content: string
    createdAt: Date
    createdBy: { id: string; name: string; email: string }
  }>
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
