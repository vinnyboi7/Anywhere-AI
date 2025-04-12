import WelcomeForm from "@/components/welcome-new-form"
import { ThemeProvider } from "@/components/theme-provider"

export default function NewFormPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="welcome-theme">
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
        <main className="container mx-auto px-4 py-8">
          <WelcomeForm />
        </main>
      </div>
    </ThemeProvider>
  )
}
