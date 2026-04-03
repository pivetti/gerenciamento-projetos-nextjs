"use client";

import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { SidebarNav } from "./SidebarNav";

export function MobileTopbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="lg:hidden">
        <div className="sticky top-0 z-30 mx-4 mt-4 flex items-center justify-between rounded-[18px] border border-white/70 bg-white/88 px-4 py-3 shadow-[0_10px_30px_rgba(74,16,135,0.08)] backdrop-blur">
          <p className="text-[1.65rem] font-semibold tracking-tight text-slate-950">ProjectHub</p>
          <button
            type="button"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-950"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4 rounded-full bg-slate-950" />
              <span className="block h-0.5 w-4 rounded-full bg-slate-950" />
              <span className="block h-0.5 w-4 rounded-full bg-slate-950" />
            </span>
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
          />

          <div className="relative ml-auto h-full max-w-[18rem] bg-[#220f49] px-5 py-6 text-white shadow-[0_24px_60px_rgba(10,8,22,0.45)]">
            <div className="mb-8 flex items-center justify-between gap-3">
              <p className="text-2xl font-semibold tracking-tight">ProjectHub</p>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg text-white"
              >
                x
              </button>
            </div>

            <SidebarNav onNavigate={() => setIsOpen(false)} />
            <LogoutButton className="mt-6" />
          </div>
        </div>
      ) : null}
    </>
  );
}
