"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram, Users, Trophy, ArrowLeft } from "lucide-react"

export function OnboardingFlow() {
  const router = useRouter()

  return (
    <Card className="w-full max-w-2xl bg-black/90 border-red-900/20">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <CardTitle className="text-3xl text-white mb-2">Welcome to Raptors Esports!</CardTitle>
        <CardDescription className="text-gray-400 text-lg">
          Your account has been created, but you need to be assigned a role to access the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Join the Elite</h3>
          <p className="text-gray-400">
            Connect with our community and get started on your esports journey. Our admins will review your profile and
            assign you the appropriate role.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Join Discord</h4>
              <p className="text-gray-400 text-sm mb-4">
                Connect with teammates and stay updated on matches and events.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Join Discord Server</Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <Instagram className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Follow Us</h4>
              <p className="text-gray-400 text-sm mb-4">Stay updated with highlights, announcements, and team news.</p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">Follow on Instagram</Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h4 className="font-bold text-white mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            What happens next?
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li>• Our admins will review your profile</li>
            <li>• You'll be assigned a role based on your experience</li>
            <li>• Once assigned, you'll have access to the full platform</li>
            <li>• You'll receive an email notification when ready</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Questions? Contact us at{" "}
            <a href="mailto:admin@raptorsesports.com" className="text-red-500 hover:underline">
              admin@raptorsesports.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
