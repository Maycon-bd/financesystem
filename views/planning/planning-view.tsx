"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, AlertTriangle } from "lucide-react"
import { getGoals } from "@/controllers/goal-controller"
import { GoalForm } from "./goal-form"
import { BudgetAlert } from "./budget-alert"
import type { Goal } from "@/models/goal"

export function PlanningView() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadGoals = async () => {
    setIsLoading(true)
    const userGoals = await getGoals()
    setGoals(userGoals)
    setIsLoading(false)
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleGoalCreated = () => {
    setShowGoalForm(false)
    loadGoals()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planejamento Financeiro</h1>
          <p className="text-muted-foreground">Defina metas e monitore seu progresso</p>
        </div>
        <Button onClick={() => setShowGoalForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      <BudgetAlert />

      <div className="grid gap-4 md:grid-cols-2">
        {goals.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma meta definida</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comece definindo suas metas financeiras para acompanhar seu progresso
              </p>
              <Button onClick={() => setShowGoalForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
            const daysRemaining = getDaysRemaining(goal.targetDate)

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        goal.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : goal.status === "active"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {goal.status === "completed" ? "Concluída" : goal.status === "active" ? "Ativa" : "Pausada"}
                    </div>
                  </div>
                  {goal.description && <CardDescription>{goal.description}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Atual:</span>
                    <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Meta:</span>
                    <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Restante:</span>
                    <span className="font-medium">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span>Prazo:</span>
                    <div className="flex items-center gap-1">
                      {daysRemaining < 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-600 font-medium">{Math.abs(daysRemaining)} dias atrasado</span>
                        </>
                      ) : daysRemaining < 30 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-600 font-medium">{daysRemaining} dias restantes</span>
                        </>
                      ) : (
                        <span className="font-medium">{daysRemaining} dias restantes</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {showGoalForm && <GoalForm onClose={() => setShowGoalForm(false)} onSuccess={handleGoalCreated} />}
    </div>
  )
}
