"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteTransaction } from "@/controllers/transaction-controller"
import type { Transaction } from "@/models/transaction"

interface TransactionListProps {
  transactions: Transaction[]
  onTransactionDeleted: () => void
  type: "income" | "expense"
}

export function TransactionList({ transactions, onTransactionDeleted, type }: TransactionListProps) {
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    const result = await deleteTransaction(id)

    if (result.success) {
      toast({
        title: "Sucesso",
        description: result.message,
      })
      onTransactionDeleted()
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "income" ? "Receitas" : "Despesas"} Registradas</CardTitle>
        <CardDescription>Lista de todas as {type === "income" ? "receitas" : "despesas"} cadastradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma {type === "income" ? "receita" : "despesa"} encontrada
            </p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{transaction.description}</h3>
                    {transaction.isRecurring && (
                      <Badge variant="secondary">
                        {transaction.recurringType === "monthly"
                          ? "Mensal"
                          : transaction.recurringType === "weekly"
                            ? "Semanal"
                            : "Anual"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{transaction.category?.name}</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(transaction.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
