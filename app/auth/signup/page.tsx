"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-purple-950 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-purple-950 p-4">
      <SignupForm />
      <div className="mt-4 text-center text-sm">
        <span className="text-gray-400">Already have an account? </span>
        <Link href="/auth/login" className="font-semibold text-red-500 hover:text-red-400">
          Sign in
        </Link>
      </div>
      <Link href="/" className="mt-4 text-sm text-gray-400 hover:text-white">
        &larr; Back to Home
      </Link>
    </div>
  )
}
