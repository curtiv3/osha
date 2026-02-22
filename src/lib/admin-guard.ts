import { redirect } from "next/navigation";
import { getCurrentUserContext } from "@/lib/auth-context";

export async function requireAdmin() {
  const context = await getCurrentUserContext();

  if (!context.userId) {
    redirect("/login");
  }

  if (context.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return context;
}
