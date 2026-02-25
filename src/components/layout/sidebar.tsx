import Link from "next/link";
import {
  Bot,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";
import { getCurrentUserContext } from "@/lib/auth-context";

const baseNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/checklists", label: "Checklists", icon: ClipboardCheck },
  { href: "/dashboard/incidents", label: "Incidents", icon: ShieldAlert },
  { href: "/dashboard/ai-chat", label: "AI Chat", icon: Bot },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
] as const;

const adminNavItem = {
  href: "/admin",
  label: "Admin",
  icon: Settings,
} as const;

export async function Sidebar() {
  const context = await getCurrentUserContext();
  const navItems =
    context.role === "ADMIN"
      ? [...baseNavItems, adminNavItem]
      : baseNavItems;

  return (
    <aside className="hidden w-72 border-r border-border bg-surface p-4 md:block">
      <div className="mb-6 rounded-xl border border-border bg-elevated p-4">
        <p className="font-heading text-lg text-text-primary">SafeSite</p>
        <p className="mt-1 text-xs text-text-tertiary">
          OSHA Compliance for Construction
        </p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm text-text-secondary transition hover:border-border hover:bg-elevated hover:text-text-primary"
            >
              <Icon suppressHydrationWarning className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
