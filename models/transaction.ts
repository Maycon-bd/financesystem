export interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  categoryId: string
  category?: Category
  userId: string
  date: Date
  isRecurring: boolean
  recurringType?: "monthly" | "weekly" | "yearly"
  createdAt: Date
  updatedAt: Date
}

export interface CreateTransactionData {
  description: string
  amount: number
  type: "income" | "expense"
  categoryId: string
  date: Date
  isRecurring?: boolean
  recurringType?: "monthly" | "weekly" | "yearly"
}

import type { Category } from "./category"
