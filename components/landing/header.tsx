import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggleSimple } from "@/components/theme/theme-toggle-simple"
import { LogIn, UserPlus } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-red-900/20 bg-black/90 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="Raptors Esports"
                width={120}
                height={40}
                className="h-10 w-auto transition-all duration-300"
              />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="#teams" className="text-gray-300 hover:text-red-500 transition-colors duration-300">
                Teams
              </Link>
              <Link href="#stats" className="text-gray-300 hover:text-red-500 transition-colors duration-300">
                Stats
              </Link>
              <Link href="#achievements" className="text-gray-300 hover:text-red-500 transition-colors duration-300">
                Achievements
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggleSimple />
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              <Link href="/auth/login">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white transition-all duration-300">
              <Link href="/auth/signup">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
