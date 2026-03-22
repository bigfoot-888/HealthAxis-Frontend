import { APP_LOCALE, APP_TIMEZONE } from "@/config/date-config";

export function formatDateTimeUTC(value) {
    if (!value) return 'N.A.';

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date)) return '';

    return date.toLocaleString(APP_LOCALE, {
        timeZone: APP_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatCreatedAt(value) {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date)) return '';

    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    return isToday
        ? date.toLocaleTimeString(APP_LOCALE, {
              hour: '2-digit',
              minute: '2-digit',
          })
        : date.toLocaleDateString(APP_LOCALE);
}