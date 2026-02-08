export type PublicSettings = {
  shopName: string;
  description: string;
  access: string;
  openTime: string;
  closeTime: string;
  closedDay: string;
  heroImageUrl: string;
};

export type FirestoreMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  imageUrl?: string;
};
