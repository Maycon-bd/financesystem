export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryData {
  name: string
  type: "income" | "expense"
  color: string
}
