import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { EVENTS } from '../data/events';
import { EVENTS_DESC } from '../components/home/eventDate';
import { SectionLabel, Hand, Stamp, StickerButton, Perforation } from '../components/home/scrap';
import { TicketShelf } from '../components/events/TicketShelf';
import { Report } from '../components/events/Report';
import { typeOf } from '../components/events/eventType';

// Counts per display type (label → { n, color }), newest-first order preserved.
const COUNTS = EVENTS_DESC.reduce((m, e) => {
  const [label, color] = typeOf(e);
  m[label] = { n: (m[label]?.n || 0) + 1, color };
  return m;
}, {});
const plural = (label, n) => (n > 1 && label !== 'industrial visit' ? `${label}s` : label);
const DEFAULT = EVENTS.find((e) => e.featured) || EVENTS_DESC[0];

export const EventsPage = () => {
  const root = useRef(null);
  const [params, setParams] = useSearchParams();
  const id = params.get('e');
  const event = EVENTS.find((e) => e.id === id) || DEFAULT;
  useReveal(root);

  const select = (nextId) => {
    setParams({ e: nextId });
    const el = document.getElementById('report');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Deep links: land on the report, not the shelf.
  useEffect(() => {
    if (!id) return;
    const t = setTimeout(() => document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main ref={root} className="nb min-h-screen bg-paper dotgrid">
      <div className="relative z-[2] max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel path="events/" />
            <h2 className="mt-4 text-[clamp(2.8rem,7vw,7rem)]">every event we've run.</h2>
            <p className="mt-4 max-w-xl text-lg text-pencil">Pick a ticket — the report and the photos open below.</p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {Object.entries(COUNTS).map(([label, { n, color }], i) => (
              <li key={label}><Stamp rotate={i % 2 ? 4 : -5} color={color}>{n} {plural(label, n)}</Stamp></li>
            ))}
          </ul>
        </div>

        <div className="reveal mt-6" style={{ '--reveal-i': 1 }}>
          <TicketShelf activeId={event.id} onSelect={select} />
        </div>

        <div className="mt-10 md:mt-16 pt-10 border-t-2 border-dashed border-ink/25">
          <Report event={event} onSelect={select} />
        </div>

        <div className="mt-20 flex flex-wrap items-center gap-5">
          <StickerButton href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} bg="var(--highlight)" rotate={-1.5}>more tickets ↑</StickerButton>
          <Hand className="text-xl text-pencil" rotate={-2}>{EVENTS.length} events · newest first</Hand>
        </div>
      </div>
      <Perforation color="var(--cream)" />
    </main>
  );
};
