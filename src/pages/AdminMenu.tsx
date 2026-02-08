import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import type { FirestoreMenuItem } from "../types";
import { db, storage } from "../lib/firebase";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "料理",
  sortOrder: "1",
  isPublished: true,
};

type MenuFormState = typeof initialForm;

export const AdminMenu = () => {
  const [items, setItems] = useState<FirestoreMenuItem[]>([]);
  const [form, setForm] = useState<MenuFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "menuItems"));
    const menuItems = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<FirestoreMenuItem, "id">),
    }));
    setItems(menuItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const nextValue =
      type === "checkbox" && event.target instanceof HTMLInputElement
        ? event.target.checked
        : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleEdit = (item: FirestoreMenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      sortOrder: String(item.sortOrder),
      isPublished: item.isPublished,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このメニューを削除しますか？")) return;
    await deleteDoc(doc(db, "menuItems", id));
    fetchMenu();
  };

  const handleTogglePublish = async (item: FirestoreMenuItem) => {
    await updateDoc(doc(db, "menuItems", item.id), {
      isPublished: !item.isPublished,
    });
    fetchMenu();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      sortOrder: Number(form.sortOrder),
      isPublished: form.isPublished,
    };

    if (editingId) {
      await updateDoc(doc(db, "menuItems", editingId), payload);
    } else {
      await addDoc(collection(db, "menuItems"), {
        ...payload,
        imageUrl: "",
      });
    }

    setForm(initialForm);
    setEditingId(null);
    setSaving(false);
    fetchMenu();
  };

  const handleImageUpload = async (id: string, file: File | null) => {
    if (!file) return;
    const fileRef = ref(storage, `menuItems/${id}/main.${file.name.split(".").pop()}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    await updateDoc(doc(db, "menuItems", id), { imageUrl: url });
    fetchMenu();
  };

  const sortedItems = [...items].sort((a, b) =>
    a.category === b.category
      ? a.sortOrder - b.sortOrder
      : a.category.localeCompare(b.category)
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {editingId ? "メニューを編集" : "メニューを追加"}
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name">メニュー名</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="price">価格</label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category">カテゴリ</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="料理">料理</option>
              <option value="ドリンク">ドリンク</option>
              <option value="デザート">デザート</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="sortOrder">表示順</label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description">説明</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
            />
            公開する
          </label>
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {saving ? "保存中..." : editingId ? "更新" : "追加"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">メニュー一覧</h3>
        {loading ? (
          <p className="text-sm text-slate-500">読み込み中...</p>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center"
              >
                <div className="h-24 w-32 overflow-hidden rounded-xl bg-white">
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
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>{item.category}</span>
                    <span>表示順: {item.sortOrder}</span>
                    <span>{item.isPublished ? "公開中" : "非公開"}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  <p className="text-sm font-semibold text-brand-700">
                    ¥{item.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <label className="text-xs text-slate-500">
                    画像変更
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageUpload(item.id, event.target.files?.[0] ?? null)
                      }
                      className="mt-1 block text-xs"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    className="rounded-lg border border-brand-200 px-3 py-1 text-xs text-brand-600"
                  >
                    {item.isPublished ? "非公開にする" : "公開にする"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-500"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
