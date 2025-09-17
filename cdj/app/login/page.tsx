"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginSchema, type LoginInput } from "@/lib/schemas"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginInput>({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Clear form on component mount
  useEffect(() => {
    setFormData({
      username: "",
      password: "",
    })
  }, [])

  const clearForm = () => {
    setFormData({
      username: "",
      password: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData)

        // Try both email formats
        let { data, error } = await supabase.auth.signInWithPassword({
          email: validatedData.username.includes('@') ? validatedData.username : `${validatedData.username}@cdj.local`,
          password: validatedData.password,
        })

      if (error) {
        throw error
      }

        if (data.user) {
          // Check if user is an admin using the database function
          const { data: isAdmin, error: adminError } = await supabase
            .rpc('is_current_user_admin')
            .single();

          if (adminError || !isAdmin) {
            throw new Error("Access denied. Admin privileges required.")
          }

          // Clear form and redirect to dashboard
          clearForm()
          console.log("Redirecting to dashboard...")
          router.push("/dashboard")
          router.refresh()
        }
      } catch (error: any) {
        console.error("Login error:", error)
        
        // More specific error messages
        if (error.message?.includes('Invalid login credentials')) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (error.message?.includes('Email not confirmed')) {
          setError("Please confirm your email address before logging in.")
        } else if (error.message?.includes('Access denied')) {
          setError("Access denied. Admin privileges required.")
        } else {
          setError(error.message || "Login failed. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2A2A2A] via-[#323232] to-[#1E1E1E] px-4 relative overflow-hidden">
      {/* Grid Pattern with Circle Effects */}
      
      {/* Grid pattern with neutral theme */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(#6B6B6B 1px, transparent 1px),
            linear-gradient(90deg, #5A5A5A 1px, transparent 1px),
            linear-gradient(#919191 1px, transparent 1px),
            linear-gradient(90deg, #4A4A4A 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 150px 150px, 150px 150px',
          backgroundPosition: '0 0, 0 0, 25px 25px, 25px 25px'
        }}></div>
      </div>
      
      {/* Floating Circle Effects - Theme Aligned */}
      <div className="absolute top-1/6 left-1/5 w-32 h-32 border border-[#6B6B6B]/20 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
      <div className="absolute bottom-1/4 right-1/6 w-24 h-24 border border-[#5A5A5A]/15 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
      <div className="absolute top-2/3 left-2/3 w-16 h-16 border border-[#919191]/25 rounded-full animate-pulse" style={{animationDuration: '3s', animationDelay: '2s'}}></div>
      <div className="absolute top-1/3 right-1/3 w-40 h-40 border border-[#4A4A4A]/12 rounded-full animate-pulse" style={{animationDuration: '6s', animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/6 left-1/2 w-28 h-28 border border-[#6B6B6B]/18 rounded-full animate-pulse" style={{animationDuration: '4.5s', animationDelay: '1.8s'}}></div>
      <div className="absolute top-1/2 right-1/6 w-20 h-20 border border-[#5A5A5A]/22 rounded-full animate-pulse" style={{animationDuration: '3.5s', animationDelay: '0.8s'}}></div>
      <div className="absolute top-1/8 left-3/4 w-12 h-12 border border-[#919191]/30 rounded-full animate-pulse" style={{animationDuration: '2.8s', animationDelay: '2.5s'}}></div>
      <div className="absolute bottom-2/3 right-2/3 w-36 h-36 border border-[#4A4A4A]/14 rounded-full animate-pulse" style={{animationDuration: '5.5s', animationDelay: '1.2s'}}></div>
      
      {/* Additional Medium Circle Borders */}
      <div className="absolute top-1/12 right-1/2 w-18 h-18 border border-[#8A8A8A]/20 rounded-full animate-pulse" style={{animationDuration: '3.2s', animationDelay: '0.3s'}}></div>
      <div className="absolute bottom-1/8 left-3/4 w-22 h-22 border border-[#6B6B6B]/16 rounded-full animate-pulse" style={{animationDuration: '4.2s', animationDelay: '1.6s'}}></div>
      <div className="absolute top-5/6 right-1/5 w-14 h-14 border border-[#5A5A5A]/24 rounded-full animate-pulse" style={{animationDuration: '2.6s', animationDelay: '2.2s'}}></div>
      <div className="absolute top-2/5 left-1/8 w-26 h-26 border border-[#919191]/18 rounded-full animate-pulse" style={{animationDuration: '4.8s', animationDelay: '0.7s'}}></div>
      
      {/* Gradient Circle Overlays */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#6B6B6B]/8 to-transparent rounded-full -translate-x-32 -translate-y-32 animate-pulse" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-[#5A5A5A]/6 to-transparent rounded-full translate-x-24 translate-y-24 animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-gradient-to-br from-[#919191]/5 to-transparent rounded-full -translate-x-18 -translate-y-18 animate-pulse" style={{animationDuration: '7s', animationDelay: '1.5s'}}></div>
      <div className="absolute bottom-1/3 right-1/2 w-52 h-52 bg-gradient-to-tl from-[#4A4A4A]/4 to-transparent rounded-full translate-x-26 translate-y-26 animate-pulse" style={{animationDuration: '9s', animationDelay: '3s'}}></div>
      <div className="absolute top-1/4 right-0 w-40 h-40 bg-gradient-to-bl from-[#8A8A8A]/6 to-transparent rounded-full translate-x-20 -translate-y-20 animate-pulse" style={{animationDuration: '6.5s', animationDelay: '0.8s'}}></div>
      <div className="absolute bottom-2/3 left-0 w-44 h-44 bg-gradient-to-br from-[#6B6B6B]/5 to-transparent rounded-full -translate-x-22 translate-y-22 animate-pulse" style={{animationDuration: '8.5s', animationDelay: '2.5s'}}></div>
      
      {/* Small Accent Circles */}
      <div className="absolute top-1/4 left-3/4 w-2 h-2 bg-[#B0B0B0]/40 rounded-full animate-ping" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#6B6B6B]/35 rounded-full animate-ping" style={{animationDelay: '1s', animationDuration: '2.5s'}}></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-[#919191]/30 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
      <div className="absolute top-1/5 right-2/3 w-1 h-1 bg-[#8A8A8A]/45 rounded-full animate-ping" style={{animationDelay: '0.5s', animationDuration: '2.8s'}}></div>
      <div className="absolute bottom-1/8 right-3/4 w-2.5 h-2.5 bg-[#5A5A5A]/38 rounded-full animate-ping" style={{animationDelay: '1.5s', animationDuration: '3.2s'}}></div>
      <div className="absolute top-1/8 left-1/3 w-1.5 h-1.5 bg-[#4A4A4A]/42 rounded-full animate-ping" style={{animationDelay: '0.8s', animationDuration: '2.3s'}}></div>
      <div className="absolute bottom-2/3 right-1/8 w-2 h-2 bg-[#919191]/35 rounded-full animate-ping" style={{animationDelay: '2.2s', animationDuration: '3.8s'}}></div>
      <div className="absolute top-2/3 right-3/4 w-1 h-1 bg-[#B0B0B0]/50 rounded-full animate-ping" style={{animationDelay: '1.8s', animationDuration: '2.6s'}}></div>
      <div className="absolute bottom-1/2 left-1/8 w-3 h-3 bg-[#6B6B6B]/32 rounded-full animate-ping" style={{animationDelay: '0.3s', animationDuration: '3.5s'}}></div>
      <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-[#8A8A8A]/40 rounded-full animate-ping" style={{animationDelay: '2.8s', animationDuration: '2.9s'}}></div>
      
      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] p-10 backdrop-blur-sm relative z-10 hover:shadow-3xl transition-all duration-500">
        
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <img src="/images/cdj-logo.png" alt="CDJ Auto Supply Logo" className="w-56 h-20 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-[#2A2A2A] mb-3 tracking-tight drop-shadow-sm">Welcome</h1>
          <p className="text-[#6B6B6B] text-base font-medium">Login to your admin account</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50/80 rounded-xl shadow-lg backdrop-blur-sm">
              <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="username" className="text-[#2A2A2A] font-semibold text-sm tracking-wide">
              Email
            </Label>
             <Input
               id="username"
               name="username"
               type="text"
               value={formData.username}
               onChange={handleInputChange}
               placeholder="Enter your email"
               required
               disabled={isLoading}
               autoComplete="off"
               autoCorrect="off"
               autoCapitalize="off"
               spellCheck="false"
               className="w-full h-14 px-5 border-2 border-[#D1D5DB]/60 rounded-2xl focus:border-[#2A2A2A] focus:ring-2 focus:ring-[#2A2A2A]/20 bg-white/80 backdrop-blur-sm text-[#2A2A2A] placeholder:text-[#6B6B6B] transition-all duration-300 hover:border-[#2A2A2A]/60 shadow-sm hover:shadow-md focus:shadow-lg [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-[#2A2A2A] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:#2A2A2A!important]"
             />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-[#2A2A2A] font-semibold text-sm tracking-wide">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full h-14 px-5 pr-14 border-2 border-[#D1D5DB]/60 rounded-2xl focus:border-[#2A2A2A] focus:ring-2 focus:ring-[#2A2A2A]/20 bg-white/80 backdrop-blur-sm text-[#2A2A2A] placeholder:text-[#6B6B6B] transition-all duration-300 hover:border-[#2A2A2A]/60 shadow-sm hover:shadow-md focus:shadow-lg [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-[#2A2A2A] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:#2A2A2A!important]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6B6B6B] hover:text-[#2A2A2A] transition-all duration-200 focus:outline-none hover:scale-110"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 drop-shadow-sm" />
                ) : (
                  <Eye className="h-5 w-5 drop-shadow-sm" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-[#2A2A2A] via-[#323232] to-[#2A2A2A] hover:from-[#1A1A1A] hover:via-[#000000] hover:to-[#1A1A1A] text-[#FFFFFF] font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] mt-8 relative overflow-hidden group"
            disabled={isLoading}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative">
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="tracking-wide">Signing in...</span>
                </div>
              ) : (
                <span className="tracking-wide">Login</span>
              )}
            </div>
          </Button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#D1D5DB] to-transparent"></div>
            <div className="w-1.5 h-1.5 bg-[#D1D5DB] rounded-full"></div>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#D1D5DB] to-transparent"></div>
          </div>
          <p className="text-xs text-[#6B6B6B] font-medium tracking-wide">Secure admin access • CDJ Auto Supply</p>
        </div>
      </div>
    </div>
  )
}
