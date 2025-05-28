"use server"

import type { Goal, CreateGoalData } from "@/models/goal"
import { getCurrentUser } from "./auth-controller"

// Simulação de banco de dados em memória
const goals: Goal[] = []

export async function createGoal(data: CreateGoalData): Promise<{ success: boolean; message: string; goal?: Goal }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      description: data.description,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      targetDate: data.targetDate,
      userId: user.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    goals.push(newGoal)
    return { success: true, message: "Meta criada com sucesso", goal: newGoal }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}

export async function getGoals(): Promise<Goal[]> {
  const user = await getCurrentUser()
  if (!user) return []

  return goals.filter((goal) => goal.userId === user.id)
}

export async function updateGoalProgress(id: string, amount: number): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const goalIndex = goals.findIndex((g) => g.id === id && g.userId === user.id)
    if (goalIndex === -1) {
      return { success: false, message: "Meta não encontrada" }
    }

    goals[goalIndex].currentAmount += amount
    goals[goalIndex].updatedAt = new Date()

    if (goals[goalIndex].currentAmount >= goals[goalIndex].targetAmount) {
      goals[goalIndex].status = "completed"
    }

    return { success: true, message: "Progresso atualizado com sucesso" }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}
