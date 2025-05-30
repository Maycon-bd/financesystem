import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ["latin"] })

// Carrega o StagewiseToolbar apenas no cliente e em desenvolvimento
const StagewiseToolbar = dynamic(
  () => import('@stagewise/toolbar-next').then((mod) => mod.StagewiseToolbar),
  { ssr: false }
)

const stagewiseConfig = {
  plugins: []
}

export const metadata: Metadata = {
  title: "Sistema de Gerenciamento Financeiro",
  description: "Controle suas finanças de forma inteligente",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          {process.env.NODE_ENV === 'development' && <StagewiseToolbar config={stagewiseConfig} />}
        </ThemeProvider>
      </body>
    </html>
  )
}
