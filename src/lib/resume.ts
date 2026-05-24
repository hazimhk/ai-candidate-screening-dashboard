export function normalizeSkills(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.map((skill) => skill.trim()).filter(Boolean);
  }

  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function inferSkills(resumeText: string) {
  const knownSkills = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "MongoDB",
    "Prisma",
    "AWS",
    "Docker",
    "Kubernetes",
    "Python",
    "Django",
    "FastAPI",
    "REST API",
    "GraphQL",
    "Tailwind CSS",
    "CI/CD"
  ];

  const lower = resumeText.toLowerCase();
  return knownSkills.filter((skill) => lower.includes(skill.toLowerCase()));
}
