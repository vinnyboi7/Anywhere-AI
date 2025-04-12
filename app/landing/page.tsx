import LandingPage from "@/components/landing-page"
import { ThemeProvider } from "@/components/theme-provider"

export default function Landing() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="welcome-theme">
      <LandingPage />
    </ThemeProvider>
  )
}
