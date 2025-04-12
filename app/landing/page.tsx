import LandingPage from "@/components/landing-page"
import { ThemeProvider } from "@/components/theme-provider"
import { CitySilhouettes } from "@/components/city-silhouettes"

export default function Landing() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="welcome-theme">
      <div className="min-h-screen">
        <CitySilhouettes />
        <div className="relative z-10">
          <LandingPage />
        </div>
      </div>
    </ThemeProvider>
  )
}
