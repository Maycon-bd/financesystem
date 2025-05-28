export interface Goal {
  id: string
  title: string
  description?: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  userId: string
  status: "active" | "completed" | "paused"
  createdAt: Date
  updatedAt: Date
}

export interface CreateGoalData {
  title: string
  description?: string
  targetAmount: number
  targetDate: Date
}
