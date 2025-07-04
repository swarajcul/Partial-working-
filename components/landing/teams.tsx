import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const teams = [
  {
    name: "Rebellion",
    tier: "Tier 1",
    members: 4,
    winRate: "78%",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    name: "Phoenix",
    tier: "Tier 2",
    members: 4,
    winRate: "65%",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    name: "Vanguard",
    tier: "Tier 1",
    members: 4,
    winRate: "82%",
    image: "/placeholder.svg?height=128&width=128",
  },
]

export function Teams() {
  return (
    <section id="teams" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Our <span className="text-red-500">Teams</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teams.map((team) => (
            <Card key={team.name} className="bg-black border-red-900/20 hover:border-red-500/50 transition-colors">
              <CardHeader className="text-center">
                <Image
                  src={team.image || "/placeholder.svg"}
                  alt={team.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 mx-auto rounded-full border-4 border-red-500"
                />
                <CardTitle className="text-2xl text-white">{team.name}</CardTitle>
                <Badge variant="secondary" className="bg-red-600 text-white">
                  {team.tier}
                </Badge>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Members:</span>
                  <span className="text-white">{team.members}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Win Rate:</span>
                  <span className="text-green-400 font-bold">{team.winRate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
