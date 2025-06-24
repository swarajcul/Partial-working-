"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, secondaryAction, className = "" }: EmptyStateProps) {
  return (
    <Card className={`border-dashed border-2 ${className}`}>
      <CardContent className="p-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-32 h-32 mx-auto text-muted-foreground/60"
          >
            {icon}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{description}</p>
          </motion.div>

          {/* Actions */}
          {(action || secondaryAction) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              {action && (
                <Button
                  onClick={action.onClick}
                  variant={action.variant || "default"}
                  className={action.variant === "default" || !action.variant ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button onClick={secondaryAction.onClick} variant="outline">
                  {secondaryAction.label}
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
