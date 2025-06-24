import { EnhancedMatchScheduler } from "@/components/dashboard/enhanced-match-scheduler"

export default function SchedulerPage() {
  return (
    <div className="min-h-screen bg-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Match Scheduler</h1>
          <p className="text-gray-400">Schedule and manage tournament matches with conflict detection</p>
        </div>
        <EnhancedMatchScheduler />
      </div>
    </div>
  )
}
