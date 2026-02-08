import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import type { PublicSettings } from "../types";
import { db, storage } from "../lib/firebase";

const defaultSettings: PublicSettings = {
  shopName: "",
  description: "",
  access: "",
  openTime: "",
  closeTime: "",
  closedDay: "",
  heroImageUrl: "",
};

export const AdminSettings = () => {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const snapshot = await getDoc(doc(db, "settings", "public"));
      if (snapshot.exists()) {
        setSettings({ ...defaultSettings, ...(snapshot.data() as PublicSettings) });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await updateDoc(doc(db, "settings", "public"), settings);
    setSaving(false);
  };

  const handleHeroUpload = async (file: File | null) => {
    if (!file) return;
    const fileRef = ref(storage, "public/home.png");
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    await updateDoc(doc(db, "settings", "public"), { heroImageUrl: url });
    setSettings((prev) => ({ ...prev, heroImageUrl: url }));
  };

  if (loading) {
    return <p className="text-sm text-slate-500">読み込み中...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">ホーム画像</h3>
        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          <div className="overflow-hidden rounded-xl bg-slate-50">
            {settings.heroImageUrl ? (
              <img
                src={settings.heroImageUrl}
                alt="ホーム画像"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No Image
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              新しいホーム画像をアップロードすると公開ページに反映されます。
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleHeroUpload(event.target.files?.[0] ?? null)
              }
              className="text-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">ホーム情報</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="shopName">店名</label>
            <input
              id="shopName"
              name="shopName"
              value={settings.shopName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="access">アクセス</label>
            <input
              id="access"
              name="access"
              value={settings.access}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description">紹介文</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={settings.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="openTime">開店時間</label>
            <input
              id="openTime"
              name="openTime"
              value={settings.openTime}
              onChange={handleChange}
              placeholder="11:00"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="closeTime">閉店時間</label>
            <input
              id="closeTime"
              name="closeTime"
              value={settings.closeTime}
              onChange={handleChange}
              placeholder="22:00"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="closedDay">定休日</label>
            <input
              id="closedDay"
              name="closedDay"
              value={settings.closedDay}
              onChange={handleChange}
              placeholder="水曜日"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
