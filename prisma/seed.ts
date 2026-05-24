import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_EMAIL ?? "recruiter@example.com";
  const password = process.env.DEMO_PASSWORD ?? "password123";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo Recruiter",
      passwordHash: await bcrypt.hash(password, 10)
    }
  });

  await prisma.candidate.upsert({
    where: { email: "maya.chen@example.com" },
    update: {},
    create: {
      name: "Maya Chen",
      email: "maya.chen@example.com",
      phone: "+1 555 0182",
      skills: ["React", "TypeScript", "API Integration", "Design Systems"],
      experienceYears: 5,
      resumeText:
        "Frontend engineer with five years of experience building React applications, integrating REST APIs, and implementing design systems for SaaS products.",
      aiScore: 82,
      status: "SHORTLISTED",
      aiSummary: {
        summary:
          "Strong frontend candidate with React, TypeScript, and API integration experience.",
        strengths: ["React development", "TypeScript", "UI implementation"],
        gaps: ["Limited backend ownership"],
        relevant_skills: ["React", "TypeScript", "REST APIs"],
        suggested_questions: [
          "How do you structure data fetching in React?",
          "Describe a complex UI state problem you solved."
        ],
        fit_score: 82
      }
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
