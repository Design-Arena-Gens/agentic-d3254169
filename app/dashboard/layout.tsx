import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";
import { UserButton } from "@/components/user-button";

const navItems = [
  { href: "/dashboard", label: "Mission Control" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/drivers", label: "Drivers" },
  { href: "/dashboard/finance", label: "Cash Desk" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/settings", label: "Settings" }
];

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-950">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/80 p-6 lg:flex">
        <div className="mb-10">
          <Link href="/dashboard" className="text-xl font-semibold">
            Lekya Logistics
          </Link>
          <p className="mt-2 text-xs text-slate-400">
            Autopilot your delivery operations.
          </p>
        </div>
        <nav className="flex flex-1 flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10">
          <UserButton />
        </div>
      </aside>
      <main className="flex-1">
        <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Lekya Logistics</h1>
              <p className="text-xs text-slate-400">
                Operations Console
              </p>
            </div>
            <UserButton />
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
