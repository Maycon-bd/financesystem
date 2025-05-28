"use server"

import type { User, CreateUserData, LoginData } from "@/models/user"

// Simulação de banco de dados em memória
const users: User[] = []
let currentUserId: string | null = null

export async function registerUser(data: CreateUserData): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Verificar se usuário já existe
    const existingUser = users.find((user) => user.email === data.email)
    if (existingUser) {
      return { success: false, message: "Email já cadastrado" }
    }

    // Criar novo usuário
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(newUser)
    currentUserId = newUser.id

    return { success: true, message: "Usuário criado com sucesso", user: newUser }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}

export async function loginUser(data: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const user = users.find((u) => u.email === data.email)
    if (!user) {
      return { success: false, message: "Credenciais inválidas" }
    }

    currentUserId = user.id
    return { success: true, message: "Login realizado com sucesso", user }
  } catch (error) {
    return { success: false, message: "Erro interno do servidor" }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!currentUserId) return null
  return users.find((user) => user.id === currentUserId) || null
}

export async function logoutUser(): Promise<void> {
  currentUserId = null
}
