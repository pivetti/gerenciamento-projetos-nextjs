"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projetos", label: "Projetos" },
  { href: "/participantes", label: "Participantes" },
  { href: "/atividades", label: "Atividades" },
  { href: "/recursos", label: "Recursos" },
  { href: "/custos", label: "Custos" },
  { href: "/riscos", label: "Riscos" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
