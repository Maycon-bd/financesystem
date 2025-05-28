"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, TrendingUp } from "lucide-react"
import { getMonthlyReport } from "@/controllers/transaction-controller"

export function BudgetAlert() {
  const [alert, setAlert] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkBudget = async () => {
      const currentDate = new Date()
      const month = currentDate.getMonth()
      const year = currentDate.getFullYear()

      const report = await getMonthlyReport(month, year)

      if (report) {
        // Simular alertas de orçamento
        if (report.expenses > report.income) {
          setAlert("Atenção: Suas despesas estão maiores que suas receitas este mês!")
        } else if (report.expenses > report.income * 0.8) {
          setAlert("Cuidado: Você já gastou mais de 80% da sua renda mensal.")
        } else if (report.balance > 0) {
          setAlert("Parabéns! Você está conseguindo economizar este mês.")
        }
      }

      setIsLoading(false)
    }

    checkBudget()
  }, [])

  if (isLoading || !alert) {
    return null
  }

  const isPositive = alert.includes("Parabéns")

  return (
    <Alert className={isPositive ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
      {isPositive ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      )}
      <AlertDescription className={isPositive ? "text-green-800" : "text-yellow-800"}>{alert}</AlertDescription>
    </Alert>
  )
}
