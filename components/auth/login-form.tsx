"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: true,
        callbackUrl: "/dashboard"
      });
      if (result?.error) {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-black/60 p-10 shadow-2xl backdrop-blur"
    >
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Lekya Logistics Console
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Login with your operational credentials to continue.
        </p>
      </div>
      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Invalid credentials. Please try again.
        </div>
      ) : null}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200" htmlFor="user">
          Username
        </label>
        <input
          id="user"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light focus:ring-2 focus:ring-brand-light"
          value={form.username}
          onChange={(event) =>
            setForm((current) => ({ ...current, username: event.target.value }))
          }
          placeholder="manager"
          autoComplete="username"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light focus:ring-2 focus:ring-brand-light"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="manager123"
          autoComplete="current-password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-lg transition hover:bg-brand-light disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
      <p className="text-center text-xs text-slate-400">
        Access limited to authorized Lekya Logistics staff.
      </p>
    </form>
  );
}
