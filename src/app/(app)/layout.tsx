import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCurrentUserContext } from "@/lib/auth-context";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const context = await getCurrentUserContext();

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-3 pb-20 sm:p-4 sm:pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav isAdmin={context.role === "ADMIN"} />
    </div>
  );
}
