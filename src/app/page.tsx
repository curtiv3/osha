import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Shield,
} from "lucide-react";

const fatalFour = [
  { cause: "Falls", pct: "36.5%", standard: "1926.501" },
  { cause: "Struck-by Object", pct: "15.4%", standard: "1926.451" },
  { cause: "Electrocution", pct: "7.4%", standard: "1926.405" },
  { cause: "Caught-in/between", pct: "6.2%", standard: "1926.651" },
];

const topCited = [
  { rank: 1, standard: "1926.501", name: "Fall Protection", citations: "7,271" },
  { rank: 2, standard: "1926.451", name: "Scaffolding", citations: "2,859" },
  { rank: 3, standard: "1926.1053", name: "Ladders", citations: "2,573" },
  { rank: 4, standard: "1910.1200", name: "Hazard Communication", citations: "2,424" },
  { rank: 5, standard: "1926.503", name: "Fall Protection Training", citations: "2,112" },
];

const steps = [
  {
    num: "01",
    title: "Run a jobsite checklist",
    desc: "Pick from OSHA-based templates. Walk the site. Check boxes. 5 minutes, done.",
    icon: ClipboardCheck,
  },
  {
    num: "02",
    title: "Snap a photo, get risk analysis",
    desc: "Take a photo of a concern. AI identifies the violation, cites the standard, estimates the fine.",
    icon: Camera,
  },
  {
    num: "03",
    title: "Download compliance proof",
    desc: "PDF reports ready before the inspector arrives. Every checklist, every incident, documented.",
    icon: FileText,
  },
];

export default function HomePage() {
  return (
    <main className="bg-void">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-amber-500" />
          <span className="font-heading text-lg font-bold text-text-primary">
            SafeSite
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/login"
            className="text-text-secondary transition hover:text-text-primary"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-void transition hover:bg-amber-600"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="font-heading text-3xl font-bold leading-[1.1] text-text-primary sm:text-5xl lg:text-6xl">
              Your{" "}
              <span className="font-data text-amber-500">$16,550</span>{" "}
              problem has a{" "}
              <span className="font-data text-amber-500">$29/mo</span>{" "}
              solution.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-text-secondary">
              SafeSite keeps small construction crews OSHA-compliant. Jobsite
              checklists, AI photo analysis, compliance reports — no safety
              department required.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-void transition hover:bg-amber-600"
              >
                Start Free <ArrowRight className="size-4" />
              </Link>
              <span className="text-sm text-text-tertiary">
                No credit card. No demo call.
              </span>
            </div>
          </div>

          {/* Penalty snapshot */}
          <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
              Current OSHA Penalties
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-text-secondary">
                  Serious Violation
                </p>
                <p className="font-data text-3xl text-red-500">$16,550</p>
                <p className="text-xs text-text-tertiary">per violation</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-secondary">
                  Willful / Repeat
                </p>
                <p className="font-data text-3xl text-red-500">$165,514</p>
                <p className="text-xs text-text-tertiary">per violation</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-secondary">Failure to Abate</p>
                <p className="font-data text-3xl text-red-500">$16,550</p>
                <p className="text-xs text-text-tertiary">per day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
            OSHA doesn&apos;t care that you&apos;re a small crew.
          </h2>
          <p className="mt-4 max-w-2xl text-text-secondary">
            Construction has the most OSHA inspections of any industry. Small
            subs get cited at the same rates — and pay the same fines — as large
            GCs. Here&apos;s what you&apos;re up against:
          </p>

          {/* Fatal Four */}
          <div className="mt-12">
            <h3 className="text-sm font-medium uppercase tracking-widest text-amber-500">
              The Fatal Four
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              65.5% of construction fatalities come from four causes.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {fatalFour.map((item) => (
                <div
                  key={item.cause}
                  className="rounded-lg border border-border bg-elevated p-4"
                >
                  <p className="font-data text-2xl text-text-primary">
                    {item.pct}
                  </p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {item.cause}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    29 CFR {item.standard}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cited */}
          <div className="mt-12">
            <h3 className="text-sm font-medium uppercase tracking-widest text-amber-500">
              Most Cited Construction Standards
            </h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              {topCited.map((item, i) => (
                <div
                  key={item.standard}
                  className={`flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 ${
                    i % 2 === 0 ? "bg-elevated" : "bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="font-data text-sm text-text-tertiary">
                      #{item.rank}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        29 CFR {item.standard}
                      </p>
                    </div>
                  </div>
                  <span className="font-data text-sm text-text-secondary">
                    {item.citations}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
          Three steps. Five minutes.
        </h2>
        <p className="mt-4 text-text-secondary">
          No training. No onboarding call. Open the app and go.
        </p>
        <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-10 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num}>
                <span className="font-data text-5xl font-bold text-border">
                  {step.num}
                </span>
                <Icon className="mt-3 size-6 text-amber-500" />
                <h3 className="mt-3 font-heading text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <h2 className="text-center font-heading text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 text-center text-text-secondary">
            Start free. Upgrade when you need AI photo analysis and multi-site
            support.
          </p>
          <div className="mt-8 grid gap-6 sm:mt-12 md:grid-cols-2">
            {/* Free tier */}
            <div className="rounded-xl border border-border bg-elevated p-5 sm:p-6">
              <p className="text-sm font-medium uppercase tracking-widest text-text-tertiary">
                Free
              </p>
              <p className="mt-2 font-data text-4xl text-text-primary">$0</p>
              <p className="text-sm text-text-tertiary">forever</p>
              <ul className="mt-6 space-y-3 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-green-500" />
                  Unlimited checklists
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-green-500" />
                  1 jobsite
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-green-500" />
                  Basic incident logging
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-green-500" />
                  AI compliance chat
                </li>
              </ul>
              <Link
                href="/register"
                className="mt-6 block w-full rounded-lg border border-border bg-surface py-3 text-center text-sm font-semibold text-text-primary transition hover:bg-void"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro tier */}
            <div className="relative rounded-xl border-2 border-amber-500 bg-elevated p-5 sm:p-6">
              <span className="absolute -top-3 left-4 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-void">
                MOST POPULAR
              </span>
              <p className="text-sm font-medium uppercase tracking-widest text-text-tertiary">
                Pro
              </p>
              <p className="mt-2 font-data text-4xl text-text-primary">
                $29
                <span className="text-lg text-text-tertiary">/mo</span>
              </p>
              <p className="text-sm text-text-tertiary">per company</p>
              <ul className="mt-6 space-y-3 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-amber-500" />
                  Everything in Free
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-amber-500" />
                  AI photo risk analysis
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-amber-500" />
                  Unlimited jobsites
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-amber-500" />
                  PDF compliance reports
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-amber-500" />
                  Email alerts
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-amber-500" />
                  Team accounts (up to 50)
                </li>
              </ul>
              <Link
                href="/register"
                className="mt-6 block w-full rounded-lg bg-amber-500 py-3 text-center text-sm font-bold text-void transition hover:bg-amber-600"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-20">
        <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
          Stop hoping OSHA doesn&apos;t show up.
        </h2>
        <p className="mt-4 text-text-secondary">
          5 minutes to set up. Free to start. Cheaper than a single citation.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-bold text-void transition hover:bg-amber-600"
        >
          Start Free <ArrowRight className="size-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-xs text-text-tertiary sm:flex-row sm:justify-between sm:px-6">
          <span>&copy; 2025 SafeSite</span>
          <span className="text-center">
            Built for crews who&apos;d rather be on the jobsite than in a
            courtroom.
          </span>
        </div>
      </footer>
    </main>
  );
}
