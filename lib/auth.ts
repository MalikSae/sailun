import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcrypt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Fallback supaya placeholder NEXTAUTH_SECRET tidak mematahkan login saat deploy.
  // GANTI dengan openssl rand -base64 32 di .env sebelum go-live publik.
  secret: process.env.NEXTAUTH_SECRET || "sailun-dev-secret-GANTI-SEBELUM-PRODUCTION",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email/Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const identifier = credentials.email as string
          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: identifier },
                { phone: identifier }
              ]
            }
          })

          if (!user) return null

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isPasswordValid) return null

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          }
        } catch (err) {
          // PENTING: log error aslinya — tanpa ini NextAuth menyembunyikan
          // segalanya sebagai CredentialsSignin generik
          console.error("[authorize] ERROR:", err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
})
