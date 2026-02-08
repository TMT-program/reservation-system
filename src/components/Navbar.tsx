import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Reservation", to: "/reservation" },
];

export const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-500">
            Hibiki Bistro
          </p>
          <h1 className="text-lg font-semibold text-slate-900">
            予約管理システム
          </h1>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition hover:bg-brand-50 hover:text-brand-700 ${
                  isActive ? "bg-brand-100 text-brand-700" : "text-slate-600"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <NavLink
              to="/admin/menu"
              className="rounded-full border border-brand-200 px-3 py-1 text-brand-700 transition hover:bg-brand-50"
            >
              管理画面
            </NavLink>
          ) : (
            <NavLink
              to="/admin/login"
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:bg-slate-50"
            >
              管理者ログイン
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};
