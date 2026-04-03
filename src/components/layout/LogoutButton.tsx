"use client";

import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
    } finally {
      if (typeof window !== "undefined") {
        window.location.replace("/login");
        return;
      }

      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className={`w-full rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {isSubmitting ? "Saindo..." : "Logout"}
    </button>
  );
}
