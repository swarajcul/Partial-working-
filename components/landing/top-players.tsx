import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const topPlayers = [
  {
    name: "ShadowStrike",
    team: "Rebellion",
    kills: 1247,
    winRate: "84%",
    rank: 1,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "PhoenixRise",
    team: "Phoenix",
    kills: 1156,
    winRate: "79%",
    rank: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "VanguardLead",
    team: "Vanguard",
    kills: 1089,
    winRate: "81%",
    rank: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function TopPlayers() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Top <span className="text-red-500">Players</span>
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {topPlayers.map((player) => (
            <Card key={player.name} className="bg-gray-900 border-red-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant="secondary"
                      className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      {player.rank}
                    </Badge>
                    <Avatar>
                      <AvatarImage src={player.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-white">{player.name}</h3>
                      <p className="text-gray-400">{player.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{player.kills} Kills</div>
                    <div className="text-green-400">{player.winRate} Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
