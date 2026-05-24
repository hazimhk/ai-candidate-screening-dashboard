"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-mist lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-wide text-brand">TalentScreen AI</div>
            <h1 className="mt-3 text-3xl font-bold text-ink">Recruiter workspace</h1>
            <p className="mt-3 text-slate-600">
              Review resumes, generate structured AI summaries, and keep candidate decisions organized.
            </p>
          </div>
          <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-line bg-white p-6 shadow-soft">
            <label className="grid gap-1 text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                defaultValue="recruiter@example.com"
                className="focus-ring rounded-md border border-line px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                defaultValue="password123"
                className="focus-ring rounded-md border border-line px-3 py-2"
              />
            </label>
            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}
            <button
              disabled={loading}
              className="focus-ring rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </section>
      <section className="hidden items-center bg-ink px-10 py-12 text-white lg:flex">
        <div className="max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            {[
              ["82", "Avg. AI score"],
              ["24", "Pending reviews"],
              ["11", "Shortlisted"],
              ["5m", "Summary time saved"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-5">
                <div className="text-3xl font-bold">{value}</div>
                <div className="mt-1 text-sm text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
