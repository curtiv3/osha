"use client";

import "client-only";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  LayoutDashboard,
  ShieldAlert,
  Bot,
  Menu,
} from "lucide-react";
import { useState } from "react";

const primaryNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/checklists", label: "Checklists", icon: ClipboardCheck },
  { href: "/dashboard/incidents", label: "Incidents", icon: ShieldAlert },
  { href: "/dashboard/ai-chat", label: "AI Chat", icon: Bot },
] as const;

const moreNav = [
  { href: "/dashboard/team", label: "Team" },
  { href: "/dashboard/billing", label: "Billing" },
] as const;

export function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface md:hidden">
      <div className="flex items-stretch justify-around">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition ${
                active
                  ? "text-amber-500"
                  : "text-text-tertiary active:text-text-primary"
              }`}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
        {/* More button */}
        <button
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition ${
            moreOpen
              ? "text-amber-500"
              : "text-text-tertiary active:text-text-primary"
          }`}
        >
          <Menu className="size-5" />
          More
        </button>
      </div>

      {/* More dropdown */}
      {moreOpen && (
        <div className="border-t border-border bg-elevated px-4 pb-2 pt-2">
          {moreNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-text-secondary transition active:bg-surface"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMoreOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-text-secondary transition active:bg-surface"
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
