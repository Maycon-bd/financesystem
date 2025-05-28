"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getTransactions } from "@/controllers/transaction-controller"
import { getCategories } from "@/controllers/category-controller"
import { ExpenseForm } from "./expense-form"
import { CategoryForm } from "../shared/category-form"
import { TransactionList } from "../shared/transaction-list"
import type { Transaction } from "@/models/transaction"
import type { Category } from "@/models/category"

export function ExpensesView() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const [expenseTransactions, expenseCategories] = await Promise.all([
      getTransactions("expense"),
      getCategories("expense"),
    ])
    setTransactions(expenseTransactions)
    setCategories(expenseCategories)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleTransactionCreated = () => {
    setShowExpenseForm(false)
    loadData()
  }

  const handleCategoryCreated = () => {
    setShowCategoryForm(false)
    loadData()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0)
  const fixedExpenses = transactions.filter((t) => t.isRecurring).reduce((sum, t) => sum + t.amount, 0)
  const variableExpenses = transactions.filter((t) => !t.isRecurring).reduce((sum, t) => sum + t.amount, 0)

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Despesas</h1>
          <p className="text-muted-foreground">Controle seus gastos fixos e variáveis</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCategoryForm(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
          <Button onClick={() => setShowExpenseForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Despesa
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Despesas</CardTitle>
            <CardDescription>Soma de todas as despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Fixas</CardTitle>
            <CardDescription>Gastos recorrentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(fixedExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Variáveis</CardTitle>
            <CardDescription>Gastos eventuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(variableExpenses)}</div>
          </CardContent>
        </Card>
      </div>

      <TransactionList transactions={transactions} onTransactionDeleted={loadData} type="expense" />

      {showExpenseForm && (
        <ExpenseForm
          categories={categories}
          onClose={() => setShowExpenseForm(false)}
          onSuccess={handleTransactionCreated}
        />
      )}

      {showCategoryForm && (
        <CategoryForm type="expense" onClose={() => setShowCategoryForm(false)} onSuccess={handleCategoryCreated} />
      )}
    </div>
  )
}
