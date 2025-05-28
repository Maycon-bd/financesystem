"use server"

import type { Category, CreateCategoryData } from "@/models/category"
import { getCurrentUser } from "./auth-controller"

// Simulação de banco de dados em memória
const categories: Category[] = [
  {
    id: "1",
    name: "Salário",
    type: "income",
    color: "#10B981",
    userId: "default",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Alimentação",
    type: "expense",
    color: "#EF4444",
    userId: "default",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function createCategory(
  data: CreateCategoryData,
): Promise<{ success: boolean; message: string; category?: Category }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      type: data.type,
      color: data.color,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    categories.push(newCategory)
    return { success: true, message: "Categoria criada com sucesso", category: newCategory }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}

export async function getCategories(type?: "income" | "expense"): Promise<Category[]> {
  const user = await getCurrentUser()
  if (!user) return []

  let userCategories = categories.filter((cat) => cat.userId === user.id || cat.userId === "default")

  if (type) {
    userCategories = userCategories.filter((cat) => cat.type === type)
  }

  return userCategories
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const categoryIndex = categories.findIndex((cat) => cat.id === id && cat.userId === user.id)
    if (categoryIndex === -1) {
      return { success: false, message: "Categoria não encontrada" }
    }

    categories.splice(categoryIndex, 1)
    return { success: true, message: "Categoria excluída com sucesso" }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}
