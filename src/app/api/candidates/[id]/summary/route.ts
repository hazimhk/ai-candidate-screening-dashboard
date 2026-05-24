import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { generateCandidateSummary } from "@/lib/ai";

function getErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status?: unknown }).status);
    if (Number.isInteger(status) && status >= 400 && status < 600) {
      return status;
    }
  }

  return 500;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code?: unknown }).code);
    if (code === "insufficient_quota") {
      return "OpenAI could not generate the summary because the API project has insufficient quota.";
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("OPENAI_API_KEY")) {
      return "OpenAI API key is not configured on the server.";
    }
    if (error.message.includes("model")) {
      return "The configured OpenAI model is unavailable for this API key. Check OPENAI_MODEL in your env file.";
    }
  }

  return "AI summary generation failed. Check the server logs for the underlying OpenAI or database error.";
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await requireSession();
    const candidate = await prisma.candidate.findUnique({ where: { id } });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const summary = await generateCandidateSummary({
      name: candidate.name,
      skills: candidate.skills,
      experienceYears: candidate.experienceYears,
      resumeText: candidate.resumeText
    });

    await prisma.candidate.update({
      where: { id },
      data: {
        aiSummary: summary,
        aiScore: summary.fit_score,
        status: summary.fit_score >= 75 ? "SHORTLISTED" : summary.fit_score < 45 ? "REJECTED" : "PENDING"
      }
    });

    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    if (acceptsHtml) {
      return NextResponse.redirect(new URL(`/candidates/${id}`, request.url), 303);
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("AI summary generation failed", error);
    const message = getErrorMessage(error);
    const status = getErrorStatus(error);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (acceptsHtml) {
      return NextResponse.redirect(
        new URL(`/candidates/${id}?summaryError=${encodeURIComponent(message)}`, request.url),
        303
      );
    }

    return NextResponse.json({ error: message }, { status });
  }
}
