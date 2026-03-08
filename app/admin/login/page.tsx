"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Header from "@/components/header"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const adminCredentials = {
        email: "twtog@mail.com",
        password: "TWT",
      }

      // compare email case-insensitively (emails are usually case-insensitive)
      if (
        formData.email.trim().toLowerCase() === adminCredentials.email.toLowerCase() &&
        formData.password === adminCredentials.password
      ) {
        // Persist admin auth in localStorage so AdminAuthGuard recognizes it
        const now = Date.now()
        // If rememberMe, keep admin signed-in for 30 days, otherwise 2 hours
        const expiresAt = now + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000)

        localStorage.setItem(
          "adminAuth",
          JSON.stringify({ email: adminCredentials.email, role: "admin", loginTime: new Date().toISOString(), expiresAt })
        )

        // Set a session cookie via a server action (placeholder for actual security)
        document.cookie = `admin_session=true; path=/; max-age=${rememberMe ? 30 * 24 * 60 * 60 : 2 * 60 * 60}; samesite=strict`;

        router.push("/admin/dashboard")
        return
      }

      setError("Invalid email or password")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // For demo purposes: not an admin login path
    const googleUser = { id: Date.now(), email: "user@gmail.com", name: "Google User" }
    localStorage.setItem(
      "customerAuth",
      JSON.stringify({ ...googleUser, loginTime: new Date().toISOString() })
    )
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-foreground flex items-baseline gap-3">
              <span className="swanky-brand text-2xl">TWT</span>
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Back to Store
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Sign In</h1>
            <p className="text-muted-foreground">Use your admin credentials to access the dashboard</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>Enter your email and password to access the admin dashboard</CardDescription>
              {/* gold accent underline */}
              <div className="mx-auto mt-2 swanky-underline" style={{ width: '4rem' }} />
            </CardHeader>

            <CardContent className="space-y-6">
              <Button
                variant="outline"
                className="w-full bg-transparent border-border"
                onClick={handleGoogleLogin}
                type="button"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden>
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="inline-block w-4 h-4 rounded border-border bg-background"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link href="/auth/forgot" className="text-sm text-muted-foreground hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">{error}</div>}

                <Button type="submit" variant="swanky" className="w-full swanky-focus" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
