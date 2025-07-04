"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

// This would normally come from your admin settings API
const getHeroSettings = () => ({
  heroBackgroundVideo: "", // Admin can set this
  heroBackgroundImage: "/placeholder.svg?height=600&width=1920",
  joinTeamCtaLink: "/auth/login",
  watchHighlightsCtaLink: "#",
})

export function Hero() {
  const [settings, setSettings] = useState(getHeroSettings())
  const [videoError, setVideoError] = useState(false)

  // In a real app, you'd fetch this from your API
  useEffect(() => {
    // Fetch admin settings for hero configuration
    // setSettings(fetchedSettings)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-900 opacity-90" />

      {/* Dynamic Background - Video or Image */}
      <div className="absolute inset-0">
        {settings.heroBackgroundVideo && !videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src={settings.heroBackgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={settings.heroBackgroundImage || "/placeholder.svg"}
            alt="BGMI Esports Arena - Astronauts Dropping"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            priority
          />
        )}
      </div>

      {/* Animated Particles/Stars Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="stars-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Falling Objects Animation (Astronauts/Soldiers) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="falling-object"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 text-center z-10">
        <div className="max-w-4xl mx-auto">
          {/* Animated Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
            <span className="inline-block animate-pulse">RAPTORS</span>
            <span className="block text-red-500 animate-bounce delay-300">ESPORTS</span>
          </h1>

          {/* Subtitle with Typewriter Effect */}
          <p className="text-xl md:text-3xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed">
            <span className="bg-gradient-to-r from-white via-gray-300 to-red-300 bg-clip-text text-transparent">
              Dominating BGMI battlefields with precision, strategy, and unmatched teamwork. Join the elite ranks of
              competitive mobile gaming.
            </span>
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-lg px-10 py-6 rounded-full shadow-2xl shadow-red-600/30 transform hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.href = settings.joinTeamCtaLink)}
            >
              <span className="flex items-center">
                Join Our Squad
                <ArrowRight className="ml-2 w-6 h-6" />
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-lg px-10 py-6 rounded-full shadow-2xl shadow-white/20 transform hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.href = settings.watchHighlightsCtaLink)}
            >
              <span className="flex items-center">
                <Play className="mr-2 w-6 h-6" />
                Epic Highlights
              </span>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">50+</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider">Chicken Dinners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">15</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider">Tournament Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">2.5K</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider">Total Kills</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        .stars-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .falling-object {
          position: absolute;
          animation: fall linear infinite;
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
