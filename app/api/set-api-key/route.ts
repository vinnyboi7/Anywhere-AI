import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // In a real application, you would store this securely
    // For this demo, we'll just set it in process.env
    // Note: This won't persist across server restarts in development
    process.env.OPENAI_API_KEY = apiKey

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error setting API key:", error)
    return NextResponse.json({ error: error.message || "Failed to set API key" }, { status: 500 })
  }
}
