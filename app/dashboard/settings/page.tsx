export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-400">
          Configure integrations and operational preferences.
        </p>
      </header>
      <section className="card space-y-6">
        <div>
          <h2 className="text-lg font-semibold">WhatsApp Business API</h2>
          <p className="text-xs text-slate-400">
            Configure outbound assignment alerts to driver roster groups.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase text-slate-400">
                Account SID
              </span>
              <input
                placeholder="Enter provider SID"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase text-slate-400">
                Auth Token
              </span>
              <input
                placeholder="••••••••"
                type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              />
            </label>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">SMS Gateway</h2>
          <p className="text-xs text-slate-400">
            Provide credentials to trigger OTPs for delivery confirmation.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase text-slate-400">
                API Key
              </span>
              <input
                placeholder="apikey_xxx"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase text-slate-400">
                Sender ID
              </span>
              <input
                placeholder="LEKYA"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              />
            </label>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Role Permissions</h2>
          <p className="text-xs text-slate-400">
            Logistics managers cannot access WordPress themes or plugins. Finance
            controllers only see cash desk modules.
          </p>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            Configure actual access control within the WordPress admin by
            assigning the `logistics-manager` and `finance-controller` roles.
          </div>
        </div>
      </section>
    </div>
  );
}
