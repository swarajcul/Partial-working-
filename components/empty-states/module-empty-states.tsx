"use client"

import { EmptyState } from "./empty-state"
import {
  NoTeamsIllustration,
  NoMatchesIllustration,
  NoSearchResultsIllustration,
  NoExportsIllustration,
  ErrorStateIllustration,
  NoPlayersIllustration,
  NoStatsIllustration,
} from "./illustrations"
import { RefreshCw } from "lucide-react"

interface EmptyStateComponentProps {
  onAction?: () => void
  onSecondaryAction?: () => void
}

export function NoTeamsEmptyState({ onAction, onSecondaryAction }: EmptyStateComponentProps) {
  return (
    <EmptyState
      icon={<NoTeamsIllustration />}
      title="No teams created yet"
      description="Get started by creating your first esports team. You can add players, set up matches, and track performance all in one place."
      action={
        onAction
          ? {
              label: "Create First Team",
              onClick: onAction,
            }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? {
              label: "Import Team Data",
              onClick: onSecondaryAction,
            }
          : undefined
      }
    />
  )
}

export function NoMatchesEmptyState({ onAction, onSecondaryAction }: EmptyStateComponentProps) {
  return (
    <EmptyState
      icon={<NoMatchesIllustration />}
      title="No matches scheduled"
      description="Your calendar is empty! Schedule your first match to start tracking team performance and building your competitive history."
      action={
        onAction
          ? {
              label: "Schedule Match",
              onClick: onAction,
            }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? {
              label: "View Calendar",
              onClick: onSecondaryAction,
            }
          : undefined
      }
    />
  )
}

export function NoSearchResultsEmptyState({
  onAction,
  searchTerm,
}: EmptyStateComponentProps & { searchTerm?: string }) {
  return (
    <EmptyState
      icon={<NoSearchResultsIllustration />}
      title="No results found"
      description={
        searchTerm
          ? `We couldn't find anything matching "${searchTerm}". Try adjusting your search terms or filters.`
          : "No results match your current search criteria. Try adjusting your filters or search terms."
      }
      action={
        onAction
          ? {
              label: "Clear Filters",
              onClick: onAction,
              variant: "outline",
            }
          : undefined
      }
    />
  )
}

export function NoExportsEmptyState({ onAction }: EmptyStateComponentProps) {
  return (
    <EmptyState
      icon={<NoExportsIllustration />}
      title="Export history empty"
      description="You haven't exported any reports yet. Generate your first export to keep track of your team's data and performance metrics."
      action={
        onAction
          ? {
              label: "Generate Report",
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function ErrorEmptyState({ onAction, message }: EmptyStateComponentProps & { message?: string }) {
  return (
    <EmptyState
      icon={<ErrorStateIllustration />}
      title="Something went wrong"
      description={
        message ||
        "We encountered an unexpected error while loading your data. Please try again or contact support if the problem persists."
      }
      action={
        onAction
          ? {
              label: "Try Again",
              onClick: onAction,
              variant: "outline",
            }
          : undefined
      }
      className="border-red-200 dark:border-red-800"
    />
  )
}

export function NoPlayersEmptyState({ onAction, onSecondaryAction }: EmptyStateComponentProps) {
  return (
    <EmptyState
      icon={<NoPlayersIllustration />}
      title="No players in roster"
      description="Build your dream team by adding players to your roster. Track their performance, manage roles, and organize your squad effectively."
      action={
        onAction
          ? {
              label: "Add First Player",
              onClick: onAction,
            }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? {
              label: "Import Players",
              onClick: onSecondaryAction,
            }
          : undefined
      }
    />
  )
}

export function NoStatsEmptyState({ onAction }: EmptyStateComponentProps) {
  return (
    <EmptyState
      icon={<NoStatsIllustration />}
      title="No statistics available"
      description="Start playing matches and recording performance data to see detailed analytics and insights about your team's progress."
      action={
        onAction
          ? {
              label: "Record Match Data",
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function LoadingEmptyState() {
  return (
    <EmptyState
      icon={
        <div className="w-32 h-32 flex items-center justify-center">
          <RefreshCw className="w-12 h-12 animate-spin text-orange-600" />
        </div>
      }
      title="Loading..."
      description="Please wait while we fetch your data."
    />
  )
}
