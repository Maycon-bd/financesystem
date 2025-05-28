"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Table } from "lucide-react"
import { getMonthlyReport } from "@/controllers/transaction-controller"
import { useToast } from "@/hooks/use-toast"

interface MonthlyReport {
  income: number
  expenses: number
  balance: number
  transactions: any[]
}

export function ReportsView() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  const loadReport = async () => {
    setIsLoading(true)
    const monthlyReport = await getMonthlyReport(selectedMonth, selectedYear)
    setReport(monthlyReport)
    setIsLoading(false)
  }

  useEffect(() => {
    loadReport()
  }, [selectedMonth, selectedYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const exportToPDF = () => {
    toast({
      title: "Exportação PDF",
      description: "Funcionalidade em desenvolvimento",
    })
  }

  const exportToCSV = () => {
    if (!report) return

    const csvContent = [
      ["Data", "Descrição", "Categoria", "Tipo", "Valor"].join(","),
      ...report.transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString("pt-BR"),
          t.description,
          t.category?.name || "",
          t.type === "income" ? "Receita" : "Despesa",
          t.amount.toString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${months[selectedMonth]}-${selectedYear}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Sucesso",
      description: "Relatório exportado em CSV",
    })
  }

  if (isLoading) {
    return <div>Carregando relatório...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Visualização</h1>
          <p className="text-muted-foreground">Análise detalhada das suas finanças</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={exportToCSV}>
            <Table className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
            <CardDescription>
              {months[selectedMonth]} {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(report?.income || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
            <CardDescription>
              {months[selectedMonth]} {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(report?.expenses || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saldo</CardTitle>
            <CardDescription>
              {months[selectedMonth]} {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(report?.balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(report?.balance || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico Receitas vs Despesas</CardTitle>
          <CardDescription>Comparativo mensal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-muted-foreground">Gráfico em desenvolvimento</p>
              <p className="text-sm text-muted-foreground">
                Receitas: {formatCurrency(report?.income || 0)} | Despesas: {formatCurrency(report?.expenses || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações do Período</CardTitle>
          <CardDescription>
            Todas as movimentações de {months[selectedMonth]} {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {report?.transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma transação encontrada para este período</p>
            ) : (
              report?.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category?.name} • {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
