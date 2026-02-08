import { useMemo, useState } from "react";
import type { Reservation } from "../types";
import { getReservations, saveReservation } from "../utils/storage";

const OPEN_TIME = "11:00";
const CLOSE_TIME = "22:00";
const CLOSED_DAY = 3; // Wednesday (0: Sun)

const createTimeSlots = () => {
  const slots: string[] = [];
  const [openHour, openMinute] = OPEN_TIME.split(":").map(Number);
  const [closeHour, closeMinute] = CLOSE_TIME.split(":").map(Number);
  const start = new Date();
  start.setHours(openHour, openMinute, 0, 0);
  const end = new Date();
  end.setHours(closeHour, closeMinute, 0, 0);

  for (let current = start; current <= end; ) {
    const hours = String(current.getHours()).padStart(2, "0");
    const minutes = String(current.getMinutes()).padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
    current = new Date(current.getTime() + 30 * 60 * 1000);
  }

  return slots;
};

const timeSlots = createTimeSlots();

type FormState = {
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  notes: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  guests: "2",
  date: "",
  time: "",
  notes: "",
};

export const ReservationPage = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    getReservations()
  );
  const [successMessage, setSuccessMessage] = useState<string>("");

  const selectedDateReservations = useMemo(() => {
    if (!form.date) return [];
    return reservations
      .filter((reservation) => reservation.date === form.date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [form.date, reservations]);

  const isClosedDay = (date: string) => {
    if (!date) return false;
    const day = new Date(`${date}T00:00:00`).getDay();
    return day === CLOSED_DAY;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = "お名前を入力してください。";
    if (!form.phone.trim()) nextErrors.phone = "電話番号を入力してください。";
    if (!form.guests) nextErrors.guests = "人数を選択してください。";
    if (!form.date) nextErrors.date = "日付を選択してください。";
    if (!form.time) nextErrors.time = "時間を選択してください。";

    if (form.date && isClosedDay(form.date)) {
      nextErrors.date = "定休日（水曜）のため予約できません。";
    }

    const duplicate = reservations.find(
      (reservation) =>
        reservation.date === form.date && reservation.time === form.time
    );
    if (form.date && form.time && duplicate) {
      nextErrors.time = "同じ日時にすでに予約があります。";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");

    if (!validate()) return;

    const reservation: Reservation = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      guests: Number(form.guests),
      date: form.date,
      time: form.time,
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const nextReservations = saveReservation(reservation);
    setReservations(nextReservations);
    setSuccessMessage("予約を受け付けました。ご来店をお待ちしております！");
    setForm((prev) => ({ ...initialForm, date: prev.date }));
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">予約フォーム</h2>
        <p className="text-sm text-slate-600">
          11:00〜22:00の間で30分刻みに予約が可能です。水曜は定休日です。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name">お名前</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="山田 花子"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="phone">電話番号</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="090-1234-5678"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="guests">人数</label>
              <select
                id="guests"
                name="guests"
                value={form.guests}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                  <option key={count} value={count}>
                    {count}名
                  </option>
                ))}
              </select>
              {errors.guests && (
                <p className="text-xs text-red-500">{errors.guests}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="date">日付</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="time">時間</label>
              <select
                id="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              >
                <option value="">時間を選択</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="text-xs text-red-500">{errors.time}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes">要望（任意）</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                placeholder="アレルギーや席の希望など"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            予約を確定する
          </button>
          {successMessage && (
            <p className="text-sm font-medium text-brand-600">
              {successMessage}
            </p>
          )}
        </form>

        <aside className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">当日の予約一覧</h3>
          {form.date ? (
            <p className="text-xs text-slate-500">
              {form.date} の予約状況
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              日付を選択すると予約一覧が表示されます。
            </p>
          )}
          <div className="space-y-3">
            {selectedDateReservations.length === 0 && form.date && (
              <p className="text-sm text-slate-500">予約はまだありません。</p>
            )}
            {selectedDateReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>{reservation.time}</span>
                  <span>{reservation.guests}名</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {reservation.name}
                </p>
                {reservation.notes && (
                  <p className="mt-1 text-xs text-slate-500">
                    要望: {reservation.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
