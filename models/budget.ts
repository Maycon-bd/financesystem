export interface Budget {
  id: string
  categoryId: string
  category?: Category
  amount: number
  spent: number
  month: number
  year: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateBudgetData {
  categoryId: string
  amount: number
  month: number
  year: number
}

import type { Category } from "./category"
