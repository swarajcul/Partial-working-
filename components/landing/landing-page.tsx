import { Header } from "./header"
import { Hero } from "./hero"
import { Teams } from "./teams"
import { Achievements } from "./achievements"
import { LiveStats } from "./live-stats"
import { TopPlayers } from "./top-players"
import { ScrimPartners } from "./scrim-partners"
import { Footer } from "./footer"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <Teams />
      <Achievements />
      <LiveStats />
      <TopPlayers />
      <ScrimPartners />
      <Footer />
    </div>
  )
}
