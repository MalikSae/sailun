"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: string | undefined, formData: FormData) {
  // Baca callbackUrl dari hidden field — sudah divalidasi di client (relative path only)
  const rawCallback = formData.get("callbackUrl") as string | null;
  // Double-check di server: harus relative path, tidak boleh mengandung "://"
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.includes("://")
      ? rawCallback
      : undefined;

  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: callbackUrl ?? "/login",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Email/Telepon atau password salah."
        default:
          return "Terjadi kesalahan sistem."
      }
    }
    throw error
  }
}
