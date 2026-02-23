import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen bg-void">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-accent-cool/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent-dream/10 blur-3xl" />
      </div>
      <Sidebar />
      <div className="relative flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
