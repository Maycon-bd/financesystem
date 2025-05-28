"use server"

import type { Transaction, CreateTransactionData } from "@/models/transaction"
import { getCurrentUser } from "./auth-controller"
import { getCategories } from "./category-controller"

// Simulação de banco de dados em memória
const transactions: Transaction[] = []

export async function createTransaction(
  data: CreateTransactionData,
): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description: data.description,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      userId: user.id,
      date: data.date,
      isRecurring: data.isRecurring || false,
      recurringType: data.recurringType,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    transactions.push(newTransaction)
    return { success: true, message: "Transação criada com sucesso", transaction: newTransaction }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}

export async function getTransactions(type?: "income" | "expense"): Promise<Transaction[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const categories = await getCategories()
  let userTransactions = transactions.filter((t) => t.userId === user.id)

  // Adicionar informações da categoria
  userTransactions = userTransactions.map((transaction) => ({
    ...transaction,
    category: categories.find((cat) => cat.id === transaction.categoryId),
  }))

  if (type) {
    userTransactions = userTransactions.filter((t) => t.type === type)
  }

  return userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function deleteTransaction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const transactionIndex = transactions.findIndex((t) => t.id === id && t.userId === user.id)
    if (transactionIndex === -1) {
      return { success: false, message: "Transação não encontrada" }
    }

    transactions.splice(transactionIndex, 1)
    return { success: true, message: "Transação excluída com sucesso" }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}

export async function getMonthlyReport(month: number, year: number) {
  const user = await getCurrentUser()
  if (!user) return null

  const userTransactions = await getTransactions()
  const monthTransactions = userTransactions.filter((t) => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
  })

  const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return {
    income,
    expenses,
    balance: income - expenses,
    transactions: monthTransactions,
  }
}
