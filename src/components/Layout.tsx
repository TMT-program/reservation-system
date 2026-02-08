import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Hibiki Bistro. All rights reserved.</p>
          <p>予約受付時間: 11:00〜22:00（定休日：水曜）</p>
        </div>
      </footer>
    </div>
  );
};
