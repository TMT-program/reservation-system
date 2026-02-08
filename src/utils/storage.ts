import type { MenuItem, Reservation } from "../types";
import { initialMenu } from "../data/menu";

const MENU_KEY = "reservation-menu";
const RESERVATION_KEY = "reservation-data";

export const getMenuItems = (): MenuItem[] => {
  const stored = localStorage.getItem(MENU_KEY);
  if (!stored) {
    localStorage.setItem(MENU_KEY, JSON.stringify(initialMenu));
    return initialMenu;
  }

  try {
    const parsed = JSON.parse(stored) as MenuItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMenu;
  } catch {
    return initialMenu;
  }
};

export const getReservations = (): Reservation[] => {
  const stored = localStorage.getItem(RESERVATION_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveReservation = (reservation: Reservation): Reservation[] => {
  const current = getReservations();
  const next = [reservation, ...current];
  localStorage.setItem(RESERVATION_KEY, JSON.stringify(next));
  return next;
};
