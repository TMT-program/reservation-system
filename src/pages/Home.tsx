import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../lib/firebase";
import type { PublicSettings } from "../types";

const fallbackSettings: PublicSettings = {
  shopName: "Hibiki Bistro",
  description:
    "“響”では旬の食材を使ったお料理と厳選ワインを提供しています。ご家族やご友人とのお食事、記念日のご利用にぜひご予約ください。",
  access: "東京都渋谷区桜丘町1-2-3（渋谷駅 徒歩5分）",
  openTime: "11:00",
  closeTime: "22:00",
  closedDay: "水曜日",
  heroImageUrl: "/hero.svg",
};

export const Home = () => {
  const location = useLocation();
  const [settings, setSettings] = useState<PublicSettings>(fallbackSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const snapshot = await getDoc(doc(db, "settings", "public"));
      if (snapshot.exists()) {
        const data = snapshot.data() as PublicSettings;
        setSettings({ ...fallbackSettings, ...data });
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="space-y-10">
      {location.state?.message && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {location.state.message}
        </div>
      )}
      <section className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">
            {settings.shopName}
          </p>
          <h2 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            心地よい空間で楽しむ、
            <br />
            季節のイタリアン
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {settings.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-brand-50 px-3 py-1">ランチ</span>
            <span className="rounded-full bg-brand-50 px-3 py-1">ディナー</span>
            <span className="rounded-full bg-brand-50 px-3 py-1">ワインバー</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <img
            src={settings.heroImageUrl}
            alt="店内のイメージ"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">営業時間</h3>
          <p className="mt-2 text-sm text-slate-600">
            {settings.openTime} - {settings.closeTime}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            予約受付時間に合わせてご来店ください。
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">定休日</h3>
          <p className="mt-2 text-sm text-slate-600">毎週 {settings.closedDay}</p>
          <p className="mt-1 text-xs text-slate-500">
            祝日の場合は翌日休業
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">アクセス</h3>
          <p className="mt-2 text-sm text-slate-600">{settings.access}</p>
          <p className="mt-1 text-xs text-slate-500">最寄駅: 渋谷駅</p>
          <a
            className="mt-3 inline-flex text-xs font-medium text-brand-600 hover:text-brand-700"
            href="https://maps.example.com"
            target="_blank"
            rel="noreferrer"
          >
            地図を見る →
          </a>
        </div>
      </section>
    </div>
  );
};
