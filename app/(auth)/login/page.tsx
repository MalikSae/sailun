"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { ButtonPrimary } from "@/components/ui/button-primary"
import { FormCard } from "@/components/ui/form-card"
import { TextInput } from "@/components/ui/text-input"

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawCallback = searchParams.get("callbackUrl") ?? ""
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.includes("://") ? rawCallback : ""

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setErrorMessage(undefined)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const redirectTo = callbackUrl || "/redirect"

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: redirectTo,
      })

      if (!result?.ok || result.error) {
        setErrorMessage("Email/Telepon atau password salah.")
        setPending(false)
        return
      }

      router.replace(redirectTo)
      router.refresh()
    } catch (error) {
      console.error("Login client error:", error)
      setErrorMessage("Terjadi kesalahan sistem.")
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormCard title="Login ke Sailun Community" description="Masukkan email/telepon dan password Anda.">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="p-3 text-sm text-on-accent bg-danger rounded-md">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="font-body text-[14px] text-ink font-medium">Email atau Telepon</label>
              <TextInput
                type="text"
                name="email"
                placeholder="admin@sailun.id"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-[14px] text-ink font-medium">Password</label>
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-muted hover:text-ink focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <ButtonPrimary type="submit" className="mt-2" disabled={pending}>
              {pending ? "Memproses..." : "Masuk"}
            </ButtonPrimary>
          </form>
        </FormCard>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  )
}
