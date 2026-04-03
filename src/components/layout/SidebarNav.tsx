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

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-white !text-[#2b135d] shadow-[0_18px_30px_rgba(8,5,25,0.25)]"
                : "text-[#f3efff] hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
