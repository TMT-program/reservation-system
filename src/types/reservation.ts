export type Reservation = {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  createdAt: string;
};
