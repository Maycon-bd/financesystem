"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getTransactions } from "@/controllers/transaction-controller"
import { getCategories } from "@/controllers/category-controller"
import { IncomeForm } from "./income-form"
import { CategoryForm } from "../shared/category-form"
import { TransactionList } from "../shared/transaction-list"
import type { Transaction } from "@/models/transaction"
import type { Category } from "@/models/category"

export function IncomeView() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const [incomeTransactions, incomeCategories] = await Promise.all([
      getTransactions("income"),
      getCategories("income"),
    ])
    setTransactions(incomeTransactions)
    setCategories(incomeCategories)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleTransactionCreated = () => {
    setShowIncomeForm(false)
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

  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0)

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Controle de Receitas</h1>
          <p className="text-muted-foreground">Gerencie suas fontes de renda</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCategoryForm(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
          <Button onClick={() => setShowIncomeForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Receita
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total de Receitas</CardTitle>
          <CardDescription>Soma de todas as suas receitas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
        </CardContent>
      </Card>

      <TransactionList transactions={transactions} onTransactionDeleted={loadData} type="income" />

      {showIncomeForm && (
        <IncomeForm
          categories={categories}
          onClose={() => setShowIncomeForm(false)}
          onSuccess={handleTransactionCreated}
        />
      )}

      {showCategoryForm && (
        <CategoryForm type="income" onClose={() => setShowCategoryForm(false)} onSuccess={handleCategoryCreated} />
      )}
    </div>
  )
}
