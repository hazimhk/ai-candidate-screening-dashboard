export function calculateBaselineScore(input: {
  skills: string[];
  experienceYears: number;
  resumeText: string;
}) {
  const seniorityScore = Math.min(input.experienceYears * 6, 36);
  const skillScore = Math.min(input.skills.length * 7, 35);
  const resumeDepthScore = Math.min(Math.floor(input.resumeText.length / 300) * 4, 20);
  const keywordScore = ["lead", "architect", "deploy", "api", "cloud", "security"].reduce(
    (score, keyword) => score + (input.resumeText.toLowerCase().includes(keyword) ? 2 : 0),
    0
  );

  return Math.max(35, Math.min(95, seniorityScore + skillScore + resumeDepthScore + keywordScore));
}
