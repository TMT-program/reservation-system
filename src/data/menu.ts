import type { MenuItem } from "../types";

export const initialMenu: MenuItem[] = [
  {
    id: "m1",
    name: "季節野菜の前菜盛り合わせ",
    description: "地元野菜を使った彩り豊かな前菜プレート。",
    price: 1200,
    category: "料理",
  },
  {
    id: "m2",
    name: "香草チキンのグリル",
    description: "ローズマリー香るジューシーなグリルチキン。",
    price: 1680,
    category: "料理",
  },
  {
    id: "m3",
    name: "自家製ボロネーゼパスタ",
    description: "じっくり煮込んだミートソース。",
    price: 1480,
    category: "料理",
  },
  {
    id: "d1",
    name: "クラフトレモネード",
    description: "自家製シロップの爽やかなドリンク。",
    price: 650,
    category: "ドリンク",
  },
  {
    id: "d2",
    name: "ソムリエおすすめ赤ワイン",
    description: "料理と相性の良いミディアムボディ。",
    price: 900,
    category: "ドリンク",
  },
  {
    id: "s1",
    name: "焦がしキャラメルプリン",
    description: "ほろ苦いキャラメルソースの自家製プリン。",
    price: 780,
    category: "デザート",
  },
];
