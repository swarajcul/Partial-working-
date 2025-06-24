"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  teams: string[]
  status: "confirmed" | "draft" | "conflict"
  type: string
}

interface MatchCalendarProps {
  events: CalendarEvent[]
  onDateSelect: (date: string) => void
  selectedDate?: string
}

export function MatchCalendar({ events, onDateSelect, selectedDate }: MatchCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("week")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateStr)
  }

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    onDateSelect(dateStr)
  }

  const navigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
    } else {
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() + 7)
      }
    }
    setCurrentDate(newDate)
  }

  const days = view === "month" ? getDaysInMonth(currentDate) : getWeekDays(currentDate)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "draft":
        return "bg-yellow-500"
      case "conflict":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-gray-900 border-orange-600/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Match Calendar
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
              className={
                view === "month" ? "bg-orange-600 hover:bg-orange-700" : "border-gray-600 text-white hover:bg-gray-800"
              }
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
              className={
                view === "week" ? "bg-orange-600 hover:bg-orange-700" : "border-gray-600 text-white hover:bg-gray-800"
              }
            >
              Week
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("prev")} className="text-white hover:bg-gray-800">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold text-white">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("next")} className="text-white hover:bg-gray-800">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2 h-20"></div>
              }

              const dayEvents = getEventsForDay(date)
              const isToday = date.toDateString() === new Date().toDateString()
              const isSelected = selectedDate && date.toISOString().split("T")[0] === selectedDate

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`p-2 h-20 border border-gray-600 cursor-pointer hover:bg-gray-700 rounded ${
                    isToday ? "bg-blue-900/30 border-blue-500" : ""
                  } ${isSelected ? "bg-orange-900/30 border-orange-500" : ""}`}
                >
                  <div className="text-sm text-white font-medium">{date.getDate()}</div>
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded text-white truncate ${getStatusColor(event.status)}`}
                        title={`${event.title} - ${event.time}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400 text-sm">Confirmed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-400 text-sm">Draft</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-400 text-sm">Conflict</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
