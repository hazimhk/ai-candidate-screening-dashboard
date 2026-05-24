import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { requireSession } from "@/lib/auth";
import { inferSkills } from "@/lib/resume";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await requireSession();
  const formData = await request.formData();
  const file = formData.get("resume");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Resume PDF is required" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF resumes are supported" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await pdf(buffer);
  const text = parsed.text.trim();

  return NextResponse.json({
    text,
    inferredSkills: inferSkills(text)
  });
}
