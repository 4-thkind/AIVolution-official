import { EVENTS } from '../../data/events';

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

// Parses the free-text `date` field ("18–19 Sep 2025", "22 Mar – Apr 2025") into a
// timestamp: first day number, first month name, last year.
// `sortAs` lets an entry be listed somewhere other than its real date; pass `real`
// to ignore it (the heatmap wants the real date).
export const eventTime = (e, real = false) => {
  const d = (!real && e.sortAs) || e.date || '';
  const day = parseInt((d.match(/\d{1,2}/) || ['1'])[0], 10);
  const mon = (d.match(/[A-Za-z]{3}/) || ['jan'])[0].toLowerCase();
  const year = parseInt((d.match(/\d{4}/g) || ['2000']).pop(), 10);
  return new Date(year, MONTHS[mon] ?? 0, day).getTime();
};

// Newest first, like `git log`.
export const EVENTS_DESC = [...EVENTS].sort((a, b) => eventTime(b) - eventTime(a));
