import { generateGuide } from "@/app/actions"

// Function to format our internal response to match the expected API format
function formatResponseForAPI(data: any): any {
  return {
    welcomeMessage: data.welcomeMessage,
    housing: data.housingInfo,
    jobs: data.jobListings.map((job: any) => ({
      title: job.title,
      company: job.company,
      link: job.link,
    })),
    events: data.events.map((event: any) => ({
      name: event.name,
      location: event.location,
      time: event.date,
    })),
    food: [data.foodRecommendations],
    languageHelp: data.languageLearningHelp,
    support: data.supportServices,
  }
}

export async function GET(request: Request) {
  // This is a placeholder for a REST API endpoint
  return new Response(JSON.stringify({ message: "Use POST method with form data to generate a guide" }), {
    headers: {
      "Content-Type": "application/json",
      // Add CORS headers
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const formData = {
      location: body.location || "",
      interests: Array.isArray(body.hobbies) ? body.hobbies : [],
      foodPreferences: Array.isArray(body.foodPreferences) ? body.foodPreferences : ["Anything"],
      language: body.preferredLanguage || "English",
      housing: body.housingPreference || "Apartment",
      jobField: body.jobType || "",
      budget: typeof body.budgetRange === "number" ? body.budgetRange : 1000,
      support: Array.isArray(body.supportNeeds) ? body.supportNeeds : [],
    }

    // Generate the guide
    const guideData = await generateGuide(formData as any)

    // Format the response to match the expected API format
    const formattedResponse = formatResponseForAPI(guideData)

    return new Response(JSON.stringify(formattedResponse), {
      headers: {
        "Content-Type": "application/json",
        // Add CORS headers
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Error handling POST request:", error)
    return new Response(JSON.stringify({ error: "Failed to generate guide" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        // Add CORS headers
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
