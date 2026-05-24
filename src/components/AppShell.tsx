import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/candidates", label: "Candidates" },
  { href: "/ai-summary", label: "AI Summary" }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-mist">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-5 py-6 md:block">
        <div className="text-lg font-semibold text-ink">TalentScreen AI</div>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/logout" method="post" className="absolute bottom-6 left-5 right-5">
          <button className="focus-ring w-full rounded-md border border-line px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Sign out
          </button>
        </form>
      </aside>
      <section className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-white/90 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-semibold">
              TalentScreen AI
            </Link>
            <div className="flex gap-3 text-sm">
              <Link href="/candidates">Candidates</Link>
              <Link href="/ai-summary">AI</Link>
            </div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
