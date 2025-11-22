"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createOrder } from "../actions";

export default function NewOrderPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    reference: "",
    customerName: "",
    customerPhone: "",
    address: "",
    cashOnDelivery: 0,
    notes: "",
    promisedAt: new Date().toISOString().slice(0, 16),
    barcode: ""
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]:
        name === "cashOnDelivery" ? Number(value) : value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      await createOrder({
        reference: form.reference,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        address: form.address,
        cashOnDelivery: form.cashOnDelivery,
        status: "pending",
        assignedDriverId: null,
        promisedAt: new Date(form.promisedAt).toISOString(),
        notes: form.notes,
        barcode: form.barcode,
        cashCollected: 0
      });
      router.push("/dashboard/orders");
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Order</h1>
        <p className="text-sm text-slate-400">
          Capture delivery details and prep for dispatch workflow.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-lg"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Order Reference
            </label>
            <input
              name="reference"
              value={form.reference}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              placeholder="LKYA-XXXX"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Barcode / AWB
            </label>
            <input
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              placeholder="Scan or enter AWB"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Customer Name
            </label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Customer Phone
            </label>
            <input
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400">
            Delivery Address
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            placeholder="Street, locality, city"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Cash on Delivery (₹)
            </label>
            <input
              type="number"
              name="cashOnDelivery"
              value={form.cashOnDelivery}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Promise Time
            </label>
            <input
              type="datetime-local"
              name="promisedAt"
              value={form.promisedAt}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400">
            Special Instructions
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            placeholder="Fragile, call before arrival, etc."
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-300 hover:bg-slate-800/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow hover:bg-brand-light disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isPending ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
