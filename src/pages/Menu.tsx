import { useEffect, useState } from "react";
import type { MenuCategory, MenuItem } from "../types";
import { getMenuItems } from "../utils/storage";

const categoryLabels: Record<MenuCategory, string> = {
  料理: "料理",
  ドリンク: "ドリンク",
  デザート: "デザート",
};

export const Menu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setItems(getMenuItems());
  }, []);

  const grouped = items.reduce<Record<MenuCategory, MenuItem[]>>(
    (acc, item) => {
      acc[item.category].push(item);
      return acc;
    },
    { 料理: [], ドリンク: [], デザート: [] }
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">メニュー</h2>
        <p className="text-sm text-slate-600">
          季節ごとにおすすめの料理とドリンクを更新しています。
        </p>
      </header>

      <div className="space-y-6">
        {(Object.keys(grouped) as MenuCategory[]).map((category) => (
          <section
            key={category}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {categoryLabels[category]}
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {grouped[category].map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-brand-700">
                    ¥{item.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
