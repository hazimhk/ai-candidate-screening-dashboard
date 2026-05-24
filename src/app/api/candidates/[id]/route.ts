import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { candidateSchema } from "@/lib/validators";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({ where: { id } });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json(candidate);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  const payload = candidateSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid candidate payload" }, { status: 400 });
  }

  const candidate = await prisma.candidate.update({
    where: { id },
    data: payload.data
  });

  return NextResponse.json(candidate);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  await prisma.candidate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
