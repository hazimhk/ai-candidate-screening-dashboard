import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { candidateSchema } from "@/lib/validators";

export async function GET() {
  await requireSession();
  const candidates = await prisma.candidate.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(candidates);
}

export async function POST(request: Request) {
  await requireSession();
  const payload = candidateSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid candidate payload" }, { status: 400 });
  }

  const candidate = await prisma.candidate.create({
    data: payload.data
  });

  return NextResponse.json(candidate, { status: 201 });
}
