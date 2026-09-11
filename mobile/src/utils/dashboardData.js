export const PERIOD_LABELS = {
  Hoy: ["08", "10", "12", "14", "16", "18", "20"],
  Semana: ["L", "M", "M", "J", "V", "S", "D"],
  Mes: ["01", "05", "10", "15", "20", "25", "30"]
};

function normalizeDate(value) {
  if (!value) return null;

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);
    return Number.isNaN(localDate.getTime()) ? null : localDate;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function recordDate(record) {
  return normalizeDate(record?.date || record?.createdAt || record?.created_at);
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function buildImpactChart(records = [], period = "Semana") {
  const labels = PERIOD_LABELS[period] || PERIOD_LABELS.Semana;
  const values = labels.map(() => 0);

  const validRecords = records
    .map(record => ({ ...record, date: recordDate(record) }))
    .filter(record => record.date);

  if (period === "Hoy") {
    const today = new Date();

    validRecords.forEach(record => {
      if (record.date.toDateString() !== today.toDateString()) return;

      const hour = record.date.getHours();
      const index = Math.max(0, Math.min(6, Math.floor(hour / 2) - 4));
      values[index] += Number(record.co2 || 0);
    });
  }

  if (period === "Semana") {
    const today = startOfDay(new Date());
    const mondayOffset = (today.getDay() + 6) % 7;

    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);

    validRecords.forEach(record => {
      const date = startOfDay(record.date);
      const index =
        Math.round((date.getTime() - monday.getTime()) / 86400000);

      if (index >= 0 && index < 7) {
        values[index] += Number(record.co2 || 0);
      }
    });
  }

  if (period === "Mes") {
    const today = new Date();

    validRecords.forEach(record => {
      if (
        record.date.getMonth() !== today.getMonth() ||
        record.date.getFullYear() !== today.getFullYear()
      ) {
        return;
      }

      const day = record.date.getDate();
      const index =
        day <= 4 ? 0 :
        day <= 9 ? 1 :
        day <= 14 ? 2 :
        day <= 19 ? 3 :
        day <= 24 ? 4 :
        day <= 29 ? 5 : 6;

      values[index] += Number(record.co2 || 0);
    });
  }

  return labels.map((label, index) => ({
    label,
    value: Number(values[index].toFixed(2))
  }));
}
