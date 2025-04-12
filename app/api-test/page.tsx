"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ApiTestPage() {
  const [location, setLocation] = useState("Austin")
  const [jobType, setJobType] = useState("Developer")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function testApi() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: location,
          hobbies: ["music", "technology", "outdoor"],
          foodPreferences: ["Vegetarian"],
          preferredLanguage: "English",
          housingPreference: "Apartment",
          jobType: jobType,
          budgetRange: 2000,
          supportNeeds: ["community"],
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch data")
      }

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      console.error("Error testing API:", err)
      setError("Failed to fetch data from API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test the /api/generate-guide Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter a city"
              />
            </div>

            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Input
                id="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                placeholder="Enter a job type"
              />
            </div>

            <Button onClick={testApi} disabled={loading}>
              {loading ? "Loading..." : "Test API"}
            </Button>

            {error && <p className="text-red-500">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">{JSON.stringify(response, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
