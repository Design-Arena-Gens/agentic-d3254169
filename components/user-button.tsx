"use client";

import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export function UserButton() {
  const { data } = useSession();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-200 shadow">
        <span>{data?.user?.name ?? "Operator"}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl border border-slate-800 bg-slate-900/90 p-1 text-sm shadow-xl backdrop-blur">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={`w-full rounded-lg px-4 py-2 text-left ${
                  active ? "bg-slate-800 text-white" : "text-slate-200"
                }`}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
