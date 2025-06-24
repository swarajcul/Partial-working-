import Image from "next/image"

const partners = [
  { name: "Team Alpha", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Beta Squad", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Gamma Force", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Delta Elite", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Omega Pro", logo: "/placeholder.svg?height=80&width=160" },
]

export function ScrimPartners() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Scrim <span className="text-red-500">Partners</span>
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
          {partners.map((partner) => (
            <div key={partner.name} className="grayscale hover:grayscale-0 transition-all">
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={160}
                height={80}
                className="h-12 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
