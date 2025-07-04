"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, TrendingDown, Plus, Wallet } from "lucide-react"

const transactions = [
  {
    id: "1",
    type: "income",
    category: "Tournament Prize",
    amount: 15000,
    description: "BGMI Championship - 1st Place",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "expense",
    category: "Equipment",
    amount: 2500,
    description: "Gaming Peripherals for Team",
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: "3",
    type: "income",
    category: "Sponsorship",
    amount: 8000,
    description: "Monthly Sponsorship Payment",
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: "4",
    type: "expense",
    category: "Travel",
    amount: 3200,
    description: "Tournament Travel Expenses",
    date: "2024-01-08",
    status: "pending",
  },
  {
    id: "5",
    type: "expense",
    category: "Coaching",
    amount: 1500,
    description: "Professional Coaching Session",
    date: "2024-01-05",
    status: "completed",
  },
]

const budgetCategories = [
  { name: "Equipment", allocated: 10000, spent: 6500, remaining: 3500 },
  { name: "Travel", allocated: 15000, spent: 8200, remaining: 6800 },
  { name: "Coaching", allocated: 8000, spent: 4500, remaining: 3500 },
  { name: "Marketing", allocated: 5000, spent: 2100, remaining: 2900 },
  { name: "Operations", allocated: 12000, spent: 7800, remaining: 4200 },
]

export function FinanceModule() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedCategory === "all") return true
    return transaction.category.toLowerCase() === selectedCategory.toLowerCase()
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Finance Management</h1>
            <p className="text-gray-400">Track revenue, expenses, and budget allocation</p>
          </div>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-green-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-red-400">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${netProfit.toLocaleString()}</div>
            <p className="text-xs text-green-400">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Available Budget</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$28,400</div>
            <p className="text-xs text-gray-400">Remaining this quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Allocation */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Budget Allocation</CardTitle>
          <CardDescription className="text-gray-400">Track spending against allocated budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{category.name}</span>
                  <span className="text-gray-400 text-sm">
                    ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (category.spent / category.allocated) * 100 > 80 ? "bg-red-600" : "bg-orange-600"
                    }`}
                    style={{ width: `${Math.min((category.spent / category.allocated) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{Math.round((category.spent / category.allocated) * 100)}% used</span>
                  <span className="text-green-400">${category.remaining.toLocaleString()} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <CardDescription className="text-gray-400">Latest financial activities</CardDescription>
            </div>
            <div className="flex space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="weekly" className="text-white">
                    Weekly
                  </SelectItem>
                  <SelectItem value="monthly" className="text-white">
                    Monthly
                  </SelectItem>
                  <SelectItem value="quarterly" className="text-white">
                    Quarterly
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">
                    All Categories
                  </SelectItem>
                  <SelectItem value="tournament prize" className="text-white">
                    Tournament Prize
                  </SelectItem>
                  <SelectItem value="sponsorship" className="text-white">
                    Sponsorship
                  </SelectItem>
                  <SelectItem value="equipment" className="text-white">
                    Equipment
                  </SelectItem>
                  <SelectItem value="travel" className="text-white">
                    Travel
                  </SelectItem>
                  <SelectItem value="coaching" className="text-white">
                    Coaching
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "income" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="w-5 h-5 text-white" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{transaction.description}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`font-bold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                    </div>
                  </div>
                  <Badge
                    variant={transaction.status === "completed" ? "default" : "secondary"}
                    className={transaction.status === "completed" ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
