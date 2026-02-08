import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Reservation", to: "/reservation" },
];

export const Navbar = () => {
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
        <nav className="flex gap-4 text-sm font-medium">
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
        </nav>
      </div>
    </header>
  );
};
