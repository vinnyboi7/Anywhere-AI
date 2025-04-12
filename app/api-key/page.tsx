import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ApiKeyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Welcome Anywhere</h1>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-green-800 mb-2">No API Key Required</h2>
        <p className="text-green-700 mb-4">
          Good news! The application now works without requiring any external API keys. All data is generated locally.
        </p>
        <p className="text-green-700">You can continue using the application with all features enabled.</p>
      </div>

      <div className="flex justify-center">
        <Link href="/new-form">
          <Button className="bg-blue-600 hover:bg-blue-700">Continue to Welcome Anywhere</Button>
        </Link>
      </div>
    </div>
  )
}
