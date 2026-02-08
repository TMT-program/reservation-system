export type MenuCategory = "料理" | "ドリンク" | "デザート";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
};
