import WelcomeForm from "@/components/welcome-new-form"
import { ThemeProvider } from "@/components/theme-provider"
import { CitySilhouettes } from "@/components/city-silhouettes"

export default function NewFormPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="welcome-theme">
      {/* Add id="generate" to make the navbar link work */}
      <div
        id="generate"
        className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300"
      >
        <CitySilhouettes />
        {/* Add padding-top to account for the navbar */}
        <main className="container relative z-10 mx-auto px-4 py-8 pt-20">
          <WelcomeForm />
        </main>
      </div>
    </ThemeProvider>
  )
}
