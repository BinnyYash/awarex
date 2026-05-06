import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
  try {
    const { title, description, category, location } = await request.json();

    if (!title || !description) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // If no API key set, return a mock response so the demo still works.
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(getMockResponse(title, description, category));
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are AwareX's credibility triage system. You do NOT determine truth. You evaluate credibility signals in citizen-submitted reports about civic issues, corruption, public safety, or institutional wrongdoing.

For every report, return a STRICT JSON object with this exact shape:
{
  "credibility": <integer 0-100>,
  "categoryConfirmed": "<one of: Education, Healthcare, Municipal Corruption, Public Safety, Environment, Labor Rights, Women & Child Safety, Consumer Fraud, Other>",
  "recommendedDepartment": "<specific government department or office>",
  "redFlags": [<short strings, 0-4 items>],
  "credibilitySignals": [<short strings, 1-4 items, what makes this MORE credible>],
  "summary": "<one sentence neutral summary, max 140 chars>",
  "routing": "<auto-publish | human-review | additional-evidence-needed>",
  "reasoning": "<2 sentence explanation of the score and routing decision>"
}

Scoring guidance:
- 80-100: Specific, dated, verifiable claims with documentation
- 60-79: Plausible with some specifics, would benefit from more evidence
- 40-59: Vague but possible
- 20-39: Generic complaint or unverifiable
- 0-19: Likely fabricated, defamatory, or impossibly vague

Routing rules:
- credibility >= 75 AND no red flags -> human-review (NOT auto-publish; humans always confirm)
- credibility 50-74 -> human-review with additional-evidence-needed
- credibility < 50 -> additional-evidence-needed

NEVER auto-publish. NEVER assume guilt of named individuals. Refuse and lower score if the report contains: targeted personal attacks without civic relevance, hate speech, or signs of coordinated brigading.

Return ONLY the JSON object, no markdown, no preamble.`;

    const userPrompt = `Report submission:
Title: ${title}
Description: ${description}
Citizen-selected category: ${category || "Unspecified"}
Location: ${location || "Unspecified"}

Analyze and return the JSON object.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    // Extract JSON safely
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (err) {
    console.error("Verification error:", err);
    // Fall back to mock so demo doesn't die mid-presentation
    const body = await request.json().catch(() => ({}));
    return Response.json(getMockResponse(body.title || "", body.description || "", body.category));
  }
}

function getMockResponse(title, description, category) {
  // Simple heuristic mock for offline / no-key demo runs.
  const length = (description || "").length;
  const hasNumbers = /\d/.test(description || "");
  const hasDate = /\b(20\d{2}|january|february|march|april|may|june|july|august|september|october|november|december|days?|weeks?|months?)\b/i.test(description || "");
  const score = Math.min(95, 40 + (length > 80 ? 15 : 0) + (hasNumbers ? 15 : 0) + (hasDate ? 15 : 0) + Math.floor(Math.random() * 10));

  return {
    credibility: score,
    categoryConfirmed: category || "Other",
    recommendedDepartment: category === "Education" ? "Department of School Education" :
                           category === "Healthcare" ? "Department of Health & Family Welfare" :
                           category === "Municipal Corruption" ? "Municipal Corporation / Vigilance Cell" :
                           category === "Public Safety" ? "District Police / Public Works" :
                           "District Collector's Office",
    redFlags: score < 60 ? ["Description lacks specific dates or measurable claims"] : [],
    credibilitySignals: [
      hasNumbers ? "Contains specific quantitative claims" : "Narrative-style account",
      hasDate ? "References a specific time period" : "Time period unclear",
      length > 100 ? "Detailed description provided" : "Brief description",
    ],
    summary: (title || "").slice(0, 138),
    routing: score >= 75 ? "human-review" : score >= 50 ? "human-review" : "additional-evidence-needed",
    reasoning: `Credibility scored ${score}/100 based on specificity, verifiability, and documentation signals. ${score >= 50 ? "Routed to human moderator queue before any public posting." : "More evidence needed before this can be moved forward."}`,
  };
}
