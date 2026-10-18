// Event type → display label + lane colour. (Algosphere is typed "gallery" in the data but is a hackathon.)
export const TYPE = {
  competition: ['competition', '#ff5a1f'],
  gallery: ['competition', '#ff5a1f'],
  workshop: ['workshop', '#2f6bff'],
  webinar: ['webinar', '#3ae88a'],
  visit: ['industrial visit', '#ff8fb1'],
};
export const typeOf = (e) => TYPE[e.type] || [e.type, '#6b6860'];

// "18–19 Sep 2025" → { day: '18', month: 'Sep', year: '2025' } (first day, first month, last year).
export const splitDate = (date = '') => ({
  day: (date.match(/\d{1,2}/) || ['–'])[0],
  month: (date.match(/[A-Za-z]{3}/) || [''])[0],
  year: (date.match(/\d{4}/g) || ['']).pop(),
});
