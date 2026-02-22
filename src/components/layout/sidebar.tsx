import Link from "next/link";
import { Bot, ClipboardCheck, LayoutDashboard, ShieldAlert } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/checklists", label: "Checklisten", icon: ClipboardCheck },
  { href: "/dashboard/incidents", label: "Vorfälle", icon: ShieldAlert },
  { href: "/dashboard/ai-chat", label: "AI Chat", icon: Bot },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-border bg-surface p-4 md:block">
      <p className="mb-6 font-heading text-lg text-text-primary">SafetyComplianceSaaS</p>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text-secondary transition hover:bg-elevated hover:text-text-primary"
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
