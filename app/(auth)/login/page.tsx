"use client"

import { FormCard } from "@/components/ui/form-card"
import { TextInput } from "@/components/ui/text-input"
import { ButtonPrimary } from "@/components/ui/button-primary"
import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { loginAction } from "./actions"
import { Eye, EyeOff } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { Suspense } from "react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <ButtonPrimary type="submit" className="mt-2" disabled={pending}>
      {pending ? "Memproses..." : "Masuk"}
    </ButtonPrimary>
  )
}

function LoginForm() {
  const [errorMessage, dispatch] = useActionState(loginAction, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  // Validasi callbackUrl — hanya izinkan relative path (dimulai "/", tidak mengandung "://")
  const rawCallback = searchParams.get("callbackUrl") ?? ""
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.includes("://") ? rawCallback : ""

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FormCard title="Login ke Sailun Community" description="Masukkan email/telepon dan password Anda.">
          <form action={dispatch} className="flex flex-col gap-4">
            {/* callbackUrl — dikirim ke server action */}
            {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
            {errorMessage && (
              <div className="p-3 text-sm text-on-accent bg-danger rounded-md">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="font-body text-[14px] text-ink font-medium font-medium">Email atau Telepon</label>
              <TextInput 
                type="text" 
                name="email"
                placeholder="admin@sailun.id" 
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-[14px] text-ink font-medium font-medium">Password</label>
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
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <SubmitButton />
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
