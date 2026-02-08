import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

type AdminLayoutProps = {
  children: ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-500">
            Admin Console
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">管理者画面</h2>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          ログアウト
        </button>
      </div>

      <nav className="flex gap-3 text-sm font-medium">
        <NavLink
          to="/admin/menu"
          className={({ isActive }) =>
            `rounded-full px-3 py-1 transition ${
              isActive ? "bg-brand-100 text-brand-700" : "text-slate-600"
            }`
          }
        >
          メニュー管理
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `rounded-full px-3 py-1 transition ${
              isActive ? "bg-brand-100 text-brand-700" : "text-slate-600"
            }`
          }
        >
          ホーム設定
        </NavLink>
      </nav>

      <div className="rounded-2xl bg-white p-6 shadow-sm">{children}</div>
    </div>
  );
};
