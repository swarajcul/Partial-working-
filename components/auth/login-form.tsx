"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Chrome } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Login successful",
        description: "Welcome to Raptors Esports Platform",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth flow
      await login("admin@raptorsesports.com", "google-oauth")
      toast({
        title: "Login successful",
        description: "Welcome to Raptors Esports Platform",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Google sign-in failed",
        description: "Please try again or use email/password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-black/90 border-red-900/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
        <CardDescription className="text-gray-400">Sign in to access the Raptors Esports Platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Chrome className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-900 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-900 border-gray-600 text-white"
            />
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Don't have access? Contact your team admin for an invitation.
          <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
            <strong className="text-orange-400">Test Admin Login:</strong>
            <br />
            Email: test123@admin
            <br />
            Password: Password123
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
