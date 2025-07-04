import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StyleBook - Salon Loyalty Tracker",
  description: "Complete loyalty tracking system for barbers and salons",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">StyleBook</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-gray-600 hover:text-gray-900">
                    Book Appointment
                  </a>
                  <a href="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin Dashboard
                  </a>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
