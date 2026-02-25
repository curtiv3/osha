"use client";

import "client-only";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: "ADMIN" | "SITE_MANAGER";
  company: { name: string } | null;
}

export function UserManagement({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState<string | null>(null);

  async function updateRole(id: string, role: "ADMIN" | "SITE_MANAGER") {
    setError(null);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      setError("Role update failed.");
      return;
    }

    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)));
  }

  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">User Management</h3>
      {error ? <p className="mt-2 text-sm text-accent-warm">{error}</p> : null}
      <div className="mt-4 space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-elevated p-3">
            <div>
              <p className="text-sm text-text-primary">{user.name ?? "Unnamed"}</p>
              <p className="text-xs text-text-secondary">{user.email ?? "no-email"} · {user.company?.name ?? "No company"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant={user.role === "ADMIN" ? "accent" : "outline"} size="sm" onClick={() => updateRole(user.id, "ADMIN")}>ADMIN</Button>
              <Button type="button" variant={user.role === "SITE_MANAGER" ? "accent" : "outline"} size="sm" onClick={() => updateRole(user.id, "SITE_MANAGER")}>SITE_MANAGER</Button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
