"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMonthlyReport } from "@/controllers/transaction-controller"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"

interface MonthlyReport {
  income: number
  expenses: number
  balance: number
  transactions: any[]
}

export function DashboardView() {
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReport = async () => {
      const currentDate = new Date()
      const month = currentDate.getMonth()
      const year = currentDate.getFullYear()

      const monthlyReport = await getMonthlyReport(month, year)
      setReport(monthlyReport)
      setIsLoading(false)
    }

    loadReport()
  }, [])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(report?.income || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(report?.expenses || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo do Mês</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(report?.balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(report?.balance || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.transactions.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
            <CardDescription>Suas transações mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report?.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category?.name}</p>
                  </div>
                  <div className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              )) || <p className="text-muted-foreground">Nenhuma transação encontrada</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Mensal</CardTitle>
            <CardDescription>Análise do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total de Receitas:</span>
                <span className="font-medium text-green-600">{formatCurrency(report?.income || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Despesas:</span>
                <span className="font-medium text-red-600">{formatCurrency(report?.expenses || 0)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Saldo Final:</span>
                  <span className={`font-bold ${(report?.balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(report?.balance || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
