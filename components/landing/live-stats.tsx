import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Matches Played", value: "1,247", change: "+12%" },
  { label: "Total Kills", value: "18,392", change: "+8%" },
  { label: "Avg Placement", value: "3.2", change: "+15%" },
  { label: "Total Damage", value: "2.8M", change: "+5%" },
]

export function LiveStats() {
  return (
    <section id="stats" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Live <span className="text-red-500">Statistics</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-black border-red-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-green-400">{stat.change} this month</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
