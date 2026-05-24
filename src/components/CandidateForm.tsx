"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CandidateFormProps = {
  initial?: {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    skills: string[];
    experienceYears: number;
    resumeText: string;
    status: "SHORTLISTED" | "PENDING" | "REJECTED";
  };
};

export function CandidateForm({ initial }: CandidateFormProps) {
  const router = useRouter();
  const [resumeText, setResumeText] = useState(initial?.resumeText ?? "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadResume(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("/api/resume/extract", {
      method: "POST",
      body: formData
    });

    const payload = await response.json();
    setUploading(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not read resume PDF.");
      return;
    }

    setResumeText(payload.text);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const body = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      skills: String(formData.get("skills") ?? "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      experienceYears: Number(formData.get("experienceYears") ?? 0),
      resumeText,
      status: String(formData.get("status") ?? "PENDING")
    };

    const response = await fetch(initial?.id ? `/api/candidates/${initial.id}` : "/api/candidates", {
      method: initial?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not save candidate.");
      return;
    }

    router.push(`/candidates/${payload.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Name
          <input
            name="name"
            defaultValue={initial?.name}
            required
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            defaultValue={initial?.email}
            required
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Phone
          <input
            name="phone"
            defaultValue={initial?.phone ?? ""}
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Experience years
          <input
            name="experienceYears"
            type="number"
            min="0"
            max="60"
            defaultValue={initial?.experienceYears ?? 0}
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium">
        Skills
        <input
          name="skills"
          placeholder="React, Node.js, PostgreSQL"
          defaultValue={initial?.skills.join(", ")}
          className="focus-ring rounded-md border border-line px-3 py-2"
        />
      </label>

      <div className="grid gap-3">
        <label className="text-sm font-medium">Upload resume PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadResume(file);
          }}
          className="block w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
        />
        {uploading ? <p className="text-sm text-slate-500">Extracting resume text...</p> : null}
      </div>

      <label className="grid gap-1 text-sm font-medium">
        Resume text
        <textarea
          value={resumeText}
          onChange={(event) => setResumeText(event.target.value)}
          required
          rows={10}
          className="focus-ring rounded-md border border-line px-3 py-2"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium md:w-60">
        Status
        <select
          name="status"
          defaultValue={initial?.status ?? "PENDING"}
          className="focus-ring rounded-md border border-line px-3 py-2"
        >
          <option value="PENDING">Pending</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </label>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}

      <button
        disabled={loading}
        className="focus-ring w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 md:w-fit"
      >
        {loading ? "Saving..." : initial?.id ? "Update candidate" : "Add candidate"}
      </button>
    </form>
  );
}
