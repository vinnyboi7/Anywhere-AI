import { HousingMap } from "@/components/housing/housing-map"
import { ThemeProvider } from "@/components/theme-provider"

export default function HousingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold mb-6">Housing Recommendations</h1>
          <p className="text-gray-600 mb-6">
            Browse available housing options in your area. Use the filters to narrow down your search and click on any
            property to view more details.
          </p>
          <HousingMap />
        </main>
      </div>
    </ThemeProvider>
  )
}
