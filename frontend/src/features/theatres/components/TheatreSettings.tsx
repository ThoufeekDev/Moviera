export default function TheatreSettings() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-ink">Theatre Settings</h2>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
        <p className="text-sm text-ink-muted">
          Configure pricing tiers, operational hours, and staff permissions.
        </p>
      </div>
    </div>
  );
}