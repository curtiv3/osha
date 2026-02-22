interface AdminAnalytics {
  users: number;
  companies: number;
  incidents: number;
  highRiskIncidents: number;
  aiChats: number;
  conversionHint: number;
}

export function AnalyticsPanel({ data }: { data: AdminAnalytics }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-heading text-lg text-text-primary">Admin Analytics</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-border bg-elevated p-3"><p className="text-xs text-text-secondary">Users</p><p className="font-data text-xl text-text-primary">{data.users}</p></div>
        <div className="rounded-md border border-border bg-elevated p-3"><p className="text-xs text-text-secondary">Companies</p><p className="font-data text-xl text-text-primary">{data.companies}</p></div>
        <div className="rounded-md border border-border bg-elevated p-3"><p className="text-xs text-text-secondary">Incidents</p><p className="font-data text-xl text-text-primary">{data.incidents}</p></div>
        <div className="rounded-md border border-border bg-elevated p-3"><p className="text-xs text-text-secondary">High Risk Incidents</p><p className="font-data text-xl text-accent-warm">{data.highRiskIncidents}</p></div>
        <div className="rounded-md border border-border bg-elevated p-3"><p className="text-xs text-text-secondary">AI Chats</p><p className="font-data text-xl text-text-primary">{data.aiChats}</p></div>
        <div className="rounded-md border border-border bg-elevated p-3"><p className="text-xs text-text-secondary">Users/Company</p><p className="font-data text-xl text-accent-cool">{data.conversionHint}</p></div>
      </div>
    </article>
  );
}
