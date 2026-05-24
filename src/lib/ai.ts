import OpenAI from "openai";
import { calculateBaselineScore } from "@/lib/scoring";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export type CandidateAiSummary = {
  summary: string;
  strengths: string[];
  gaps: string[];
  relevant_skills: string[];
  suggested_questions: string[];
  fit_score: number;
  generated_by?: "openai" | "demo";
};

function isQuotaError(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code?: unknown }).code) === "insufficient_quota";
  }

  return error instanceof Error && error.message.toLowerCase().includes("insufficient quota");
}

function createDemoSummary(candidate: {
  name: string;
  skills: string[];
  experienceYears: number;
  resumeText: string;
}): CandidateAiSummary {
  const score = calculateBaselineScore(candidate);
  const skills = candidate.skills.length > 0 ? candidate.skills : ["Resume review", "Role alignment"];
  const lowerResume = candidate.resumeText.toLowerCase();
  const hasBackend = ["node", "express", "api", "postgres", "mongodb", "prisma"].some((term) =>
    lowerResume.includes(term)
  );
  const hasCloud = ["aws", "azure", "gcp", "docker", "kubernetes", "vercel", "railway"].some((term) =>
    lowerResume.includes(term)
  );
  const hasLeadership = ["lead", "mentor", "architect", "owned", "managed"].some((term) =>
    lowerResume.includes(term)
  );

  const strengths = [
    candidate.experienceYears >= 4
      ? `${candidate.experienceYears} years of relevant experience`
      : "Clear baseline experience for the role",
    ...skills.slice(0, 3).map((skill) => `${skill} experience`)
  ].slice(0, 4);

  const gaps = [
    !hasBackend ? "Limited backend ownership evidence in the resume" : "",
    !hasCloud ? "Needs more visible cloud or deployment experience" : "",
    !hasLeadership ? "Leadership and mentoring scope is not clearly shown" : ""
  ].filter(Boolean);

  return {
    summary: `${candidate.name} appears to be a ${candidate.experienceYears}+ year candidate with experience in ${skills
      .slice(0, 4)
      .join(", ")}. This demo summary was generated locally because the OpenAI API project has no available quota.`,
    strengths,
    gaps: gaps.length > 0 ? gaps : ["No major gaps detected from the provided resume text"],
    relevant_skills: skills.slice(0, 6),
    suggested_questions: [
      `Describe a recent project where you used ${skills[0]}.`,
      "Which parts of the system did you personally own end to end?",
      "How do you validate AI-generated hiring summaries before sharing them with a recruiter?",
      "What production issues have you debugged, and how did you prevent them from recurring?"
    ],
    fit_score: score,
    generated_by: "demo"
  };
}

export async function generateCandidateSummary(candidate: {
  name: string;
  skills: string[];
  experienceYears: number;
  resumeText: string;
}) {
  const mode = process.env.AI_SUMMARY_MODE ?? "auto";

  if (mode === "demo") {
    return createDemoSummary(candidate);
  }

  if (!process.env.OPENAI_API_KEY) {
    if (mode === "auto") {
      return createDemoSummary(candidate);
    }

    throw new Error("OPENAI_API_KEY is not configured");
  }

  const baseline = calculateBaselineScore(candidate);

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical recruiter. Return strict JSON with keys summary, strengths, gaps, relevant_skills, suggested_questions, and fit_score. Keep fit_score as an integer from 0 to 100."
        },
        {
          role: "user",
          content: JSON.stringify({
            task:
              "Summarize this candidate for an HR dashboard. Identify hiring strengths, gaps, relevant skills, interview questions, and an overall fit score. Calibrate the score around the baseline but adjust if the resume evidence is stronger or weaker.",
            baseline_fit_score: baseline,
            candidate
          })
        }
      ]
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      throw new Error("AI response was empty");
    }

    const parsed = JSON.parse(content) as CandidateAiSummary;
    parsed.fit_score = Math.max(0, Math.min(100, Math.round(parsed.fit_score ?? baseline)));
    parsed.strengths = Array.isArray(parsed.strengths) ? parsed.strengths : [];
    parsed.gaps = Array.isArray(parsed.gaps) ? parsed.gaps : [];
    parsed.relevant_skills = Array.isArray(parsed.relevant_skills) ? parsed.relevant_skills : [];
    parsed.suggested_questions = Array.isArray(parsed.suggested_questions)
      ? parsed.suggested_questions
      : [];
    parsed.generated_by = "openai";

    return parsed;
  } catch (error) {
    if (mode === "auto" && isQuotaError(error)) {
      console.warn("OpenAI quota unavailable. Falling back to local demo summary.");
      return createDemoSummary(candidate);
    }

    throw error;
  }
}
