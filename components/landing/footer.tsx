"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Youtube, Instagram, MessageCircle, Twitch, Mail, MapPin, Phone } from "lucide-react"

// This would normally come from your admin settings API
const getFooterSettings = () => ({
  discordServerLink: "https://discord.gg/raptors",
  youtubeChannelLink: "#",
  twitchChannelLink: "#",
  instagramProfileLink: "#",
})

export function Footer() {
  const [settings, setSettings] = useState(getFooterSettings())

  // In a real app, you'd fetch this from your API
  useEffect(() => {
    // Fetch admin settings for footer links
    // setSettings(fetchedSettings)
  }, [])

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-500">RAPTORS ESPORTS</h3>
            <p className="text-gray-400">
              Elite BGMI team dominating the competitive scene with precision and strategy.
            </p>
            <div className="flex space-x-4">
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => window.open(settings.youtubeChannelLink, "_blank")}
              >
                <Youtube className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => window.open(settings.instagramProfileLink, "_blank")}
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => window.open(settings.discordServerLink, "_blank")}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => window.open(settings.twitchChannelLink, "_blank")}
              >
                <Twitch className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/auth/login" className="hover:text-red-500 transition-colors">
                  Join Team
                </Link>
              </li>
              <li>
                <Link href="#teams" className="hover:text-red-500 transition-colors">
                  Our Teams
                </Link>
              </li>
              <li>
                <Link href="#achievements" className="hover:text-red-500 transition-colors">
                  Achievements
                </Link>
              </li>
              <li>
                <Link href="#tournaments" className="hover:text-red-500 transition-colors">
                  Tournaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@raptorsesports.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-gray-400 text-sm">Get the latest updates on matches, tournaments, and team news.</p>
            <div className="flex space-x-2">
              <Input placeholder="Enter email" className="bg-gray-800 border-gray-600 text-white" />
              <Button className="bg-red-600 hover:bg-red-700">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Raptors Esports. All rights reserved. Built for champions.</p>
        </div>
      </div>
    </footer>
  )
}
