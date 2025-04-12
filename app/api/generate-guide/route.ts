import { NextResponse } from "next/server"
import { generateGuide } from "@/lib/guide-generator"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.zipCode) {
      return NextResponse.json({ error: "ZIP code is required" }, { status: 400 })
    }

    // Generate the personalized guide
    const guideData = await generateGuide({
      zipCode: body.zipCode,
      hobbies: Array.isArray(body.hobbies) ? body.hobbies : [],
      foodPreferences: Array.isArray(body.foodPreferences) ? body.foodPreferences : ["Anything"],
      preferredLanguage: body.preferredLanguage || "English",
      housingPreference: body.housingPreference || "Apartment",
      jobType: body.jobType || "",
      budgetRange: typeof body.budgetRange === "number" ? body.budgetRange : 1000,
      supportNeeds: Array.isArray(body.supportNeeds) ? body.supportNeeds : [],
    })

    return NextResponse.json(guideData)
  } catch (error: any) {
    console.error("Error generating guide:", error)
    return NextResponse.json({ error: error.message || "Failed to generate guide" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: "Use POST method with user preferences to generate a personalized guide",
  })
}
