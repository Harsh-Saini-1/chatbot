import { NextResponse } from "next/server";

export async function POST(req) {
  const { message } = await req.json();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.error?.message || "Failed to fetch from Gemini API");
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from API");
    }

    return NextResponse.json({ 
      reply: data.candidates[0].content.parts[0].text 
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: error.status || 500 }
    );
  }
}
