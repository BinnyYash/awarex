import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
    const { rawText } = body;

    if (!rawText || rawText.trim().length < 20) {
      return Response.json(
        { error: "Please describe what happened in at least a sentence or two." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(getMockPrefill(rawText));
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are AwareX's intake assistant. Citizens describe civic incidents to you in natural language — sometimes panicked, sometimes incomplete, sometimes in mixed languages. Your job is to extract a clean, structured report from their words so they don't have to do that work themselves.

Return STRICT JSON with this exact shape:
{
  "suggestedTitle": "<one-sentence headline, max 100 chars, specific and factual>",
  "polishedDescription": "<a cleaned-up version of their account in clear English. Preserve every fact they mentioned. Do not add facts they did not state. Do not soften or sensationalize.>",
  "detectedCategory": "<one of: Education, Healthcare, Municipal Corruption, Public Safety, Environment, Labor Rights, Women & Child Safety, Consumer Fraud, Other>",
  "detectedLocation": "<location if mentioned, else empty string>",
  "suggestedDepartment": "<specific government department or office that handles this>",
  "anonymityRecommendation": {
    "recommend": <true | false>,
    "reasoning": "<one sentence explaining why anonymity is or isn't recommended for this specific case>"
  },
  "missingEvidence": [<0-3 short strings — types of evidence the citizen should consider adding to strengthen the report>],
  "extractedFacts": [<2-5 short strings — the key verifiable facts you pulled from their description>],
  "languageDetected": "<English, Hindi, Telugu, mixed, etc.>"
}

Rules:
- PRESERVE every fact the citizen mentioned. NEVER invent or assume facts.
- Recommend anonymity = true when the citizen names or implies a powerful person, institution, employer, or local power-holder they could face retaliation from. Otherwise default to true (anonymity by default is the platform's principle).
- Flag missing evidence specifically — "specific dates," "photographs of X," "names of witnesses," "copies of complaints filed" — never generic.
- The polishedDescription should sound respectful and citizen-authored, NOT bureaucratic. Do not patronize.
- Return ONLY the JSON object. No markdown, no preamble, no explanation.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: "user", content: `Citizen's account:\n\n${rawText}` }
      ],
    });

    const text = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (err) {
    console.error("Prefill error:", err);
    return Response.json(getMockPrefill(body?.rawText || ""));
  }
}

function getMockPrefill(rawText) {
  const t = (rawText || "").toLowerCase();
  let category = "Other";
  let department = "District Collector's Office";

  if (/school|college|education|teacher|student|hostel|tuition/.test(t)) {
    category = "Education";
    department = "Department of School Education";
  } else if (/doctor|hospital|health|medic|phc|clinic|patient/.test(t)) {
    category = "Healthcare";
    department = "Department of Health & Family Welfare";
  } else if (/bribe|corrupt|kickback|misuse|funds|contractor/.test(t)) {
    category = "Municipal Corruption";
    department = "Vigilance Cell / Municipal Corporation";
  } else if (/safety|accident|streetlight|highway|police|crime/.test(t)) {
    category = "Public Safety";
    department = "District Police / Public Works Department";
  } else if (/water|garbage|sewage|pollution|environment|tree/.test(t)) {
    category = "Environment";
    department = "Pollution Control Board";
  }

  const namesPower = /principal|officer|minister|contractor|employer|landlord|manager/.test(t);

  return {
    suggestedTitle: ((rawText || "").split(".")[0] || "Civic incident report").slice(0, 95),
    polishedDescription: rawText || "",
    detectedCategory: category,
    detectedLocation: "",
    suggestedDepartment: department,
    anonymityRecommendation: {
      recommend: true,
      reasoning: namesPower
        ? "The account references a person in a position of authority — anonymous reporting reduces retaliation risk."
        : "Anonymity by default protects citizens until they explicitly choose otherwise.",
    },
    missingEvidence: [
      "Specific dates and times of incidents",
      "Photographs or documents supporting the account",
      "Names of officials or formal complaints already filed",
    ],
    extractedFacts: [
      ((rawText || "").split(".")[0] || "").slice(0, 100),
    ].filter(Boolean),
    languageDetected: "English",
  };
}
