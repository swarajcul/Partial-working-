import { Trophy, Medal, Target, Zap } from "lucide-react"

const achievements = [
  {
    icon: Trophy,
    title: "Tournament Wins",
    count: "24",
    description: "Major tournaments conquered",
  },
  {
    icon: Medal,
    title: "Championship Titles",
    count: "8",
    description: "Regional championships",
  },
  {
    icon: Target,
    title: "Top 3 Finishes",
    count: "156",
    description: "Consistent performance",
  },
  {
    icon: Zap,
    title: "Kill Record",
    count: "2,847",
    description: "Total eliminations",
  },
]

export function Achievements() {
  return (
    <section id="achievements" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Our <span className="text-red-500">Achievements</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {achievements.map((achievement) => (
            <div key={achievement.title} className="text-center group">
              <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500 transition-colors">
                <achievement.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{achievement.count}</h3>
              <h4 className="text-xl font-semibold text-red-500 mb-2">{achievement.title}</h4>
              <p className="text-gray-400">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
