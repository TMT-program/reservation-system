import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import type { FirestoreMenuItem } from "../types";
import { db } from "../lib/firebase";

export const Menu = () => {
  const [items, setItems] = useState<FirestoreMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const snapshot = await getDocs(collection(db, "menuItems"));
      const menuItems = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<FirestoreMenuItem, "id">),
      }));
      setItems(menuItems);
      setLoading(false);
    };

    fetchMenu();
  }, []);

  const publishedItems = useMemo(
    () => items.filter((item) => item.isPublished),
    [items]
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">メニュー</h2>
        <p className="text-sm text-slate-600">
          季節ごとにおすすめの料理とドリンクを更新しています。
        </p>
      </header>

      {loading ? (
        <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">
          メニューを読み込み中です…
        </div>
      ) : (
        <div className="space-y-6">
          {publishedItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              現在公開中のメニューがありません。
            </div>
          ) : (
            publishedItems
              .sort((a, b) =>
                a.category === b.category
                  ? a.sortOrder - b.sortOrder
                  : a.category.localeCompare(b.category)
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-[160px_1fr]"
                >
                  <div className="overflow-hidden rounded-xl bg-slate-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        {item.category}
                      </span>
                      <span>表示順: {item.sortOrder}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <p className="text-base font-semibold text-brand-700">
                      ¥{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};
