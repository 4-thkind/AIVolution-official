import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TEAM } from '../../data/team';
import '../../styles/emulsion.css';

// Exact Emulsion Palette
const THEME = {
  wall: '#EFE7DA',
  ink: '#1C1815',
  sub: '#6B6156',
  nav: 'rgba(28, 24, 21, 0.70)',
  hair: 'rgba(28, 24, 21, 0.22)',
  accent: '#CE4429',
  card: '#FCF8F1',
  shadowNear: '0 26px 48px -18px rgba(50,34,22,0.42), 0 3px 10px rgba(50,34,22,0.16)',
  shadowFar: '0 14px 26px -12px rgba(50,34,22,0.30), 0 2px 6px rgba(50,34,22,0.12)',
};

// Ordered team roster preserving original order & Ashwani Jha in Event Management
const OFFICE_NAMES = ['Rahul', 'Apoorva', 'Naman', 'Kshitij'];
const TECH_NAMES = ['Ishan', 'Diwakar', 'Kriti', 'Aparna', 'Sumit Bhatt'];
const EVENT_NAMES = ['Parth', 'Madhur', 'Sumit Kumar', 'Kanishka Bhardwaj', 'Ashwani Jha'];
const SOCIAL_NAMES = ['Apoorva', 'Naman'];
const PR_NAMES = ['Sharad', 'Bharti', 'Vansh', 'Falak'];

function getOrderedTeam() {
  const byName = (list) => list.map((name) => TEAM.find((m) => m.name === name)).filter(Boolean);

  const office = byName(OFFICE_NAMES).map((m) => ({ ...m, deptKey: 'core', deptLabel: 'Core Team', isFoil: true }));
  const tech = byName(TECH_NAMES).map((m) => ({ ...m, deptKey: 'tech', deptLabel: 'Tech & Dev' }));
  const event = byName(EVENT_NAMES).map((m) => ({ ...m, deptKey: 'event', deptLabel: 'Event Management' }));
  const social = byName(SOCIAL_NAMES).map((m) => ({ ...m, deptKey: 'social', deptLabel: 'Social Media' }));
  const pr = byName(PR_NAMES).map((m) => ({ ...m, deptKey: 'pr', deptLabel: 'Public Relations' }));

  return [...office, ...tech, ...event, ...social, ...pr];
}

const ORDERED_TEAM = getOrderedTeam();

// Navigation chapters corresponding to camera positions along the physical wall
export const DEPARTMENTS = [
  { key: 'core', label: 'Core Team', targetX: 0.0 },
  { key: 'tech', label: 'Tech & Dev', targetX: 2.6 },
  { key: 'event', label: 'Event Management', targetX: 5.4 },
  { key: 'social', label: 'Social Media', targetX: 8.2 },
  { key: 'pr', label: 'Public Relations', targetX: 11.0 },
];

// Department configuration defining each phase:
// 1. start -> showAll: Extra scroll step! Initial cards visible, then all cards slide smoothly into the frame
// 2. showAll -> hold: Complete screen showcases all cards together with centered watermark in background
// 3. hold -> cluster: When next screen is about to arrive, cards compress & cluster together adhering to each other!
// 4. cluster -> exit: Clustered pack glides off to left as next department arrives from right
const DEPARTMENT_CONFIGS = [
  {
    key: 'core',
    label: 'Core Team',
    watermark: 'core team',
    start: 0.0,
    showAll: 0.8,
    hold: 1.4,
    cluster: 2.0,
    exit: 2.6,
    wmInitialX: -0.55,
    wmTargetX: 0.08,
    wmInitialSize: 0.42,
    wmTargetSize: 0.35,
    wmInitialBase: 0.75,
    wmTargetBase: 0.65,
    summary: {
      index: '01 — CORE TEAM',
      body: 'President, Vice-Presidents, and Secretariat steering executive leadership, technical initiatives, and cross-departmental operations.',
    },
  },
  {
    key: 'tech',
    label: 'Tech & Dev',
    watermark: 'tech & dev',
    start: 2.6,
    showAll: 3.4,
    hold: 4.1,
    cluster: 4.8,
    exit: 5.4,
    wmInitialX: 0.35,
    wmTargetX: 0.08,
    wmInitialSize: 0.42,
    wmTargetSize: 0.34,
    wmInitialBase: 0.75,
    wmTargetBase: 0.65,
    summary: {
      index: '02 — TECH & DEV',
      body: 'System architects, machine learning researchers, and full-stack engineers building modern AI solutions and platforms.',
    },
  },
  {
    key: 'event',
    label: 'Event Management',
    watermark: ['event', 'management'],
    start: 5.4,
    showAll: 6.2,
    hold: 6.9,
    cluster: 7.6,
    exit: 8.2,
    wmInitialX: 0.35,
    wmTargetX: 0.10,
    wmInitialSize: 0.22,
    wmTargetSize: 0.175,
    wmInitialBase: 0.58,
    wmTargetBase: 0.50,
    summary: {
      index: '03 — EVENT MANAGEMENT',
      body: 'Producers orchestrating national hackathons, flagship AI summits, industry roundtables, and hands-on workshops.',
    },
  },
  {
    key: 'social',
    label: 'Social Media',
    watermark: ['social', 'media'],
    start: 8.2,
    showAll: 9.0,
    hold: 9.8,
    cluster: 10.4,
    exit: 11.0,
    wmInitialX: 0.35,
    wmTargetX: 0.11,
    wmInitialSize: 0.22,
    wmTargetSize: 0.175,
    wmInitialBase: 0.58,
    wmTargetBase: 0.50,
    summary: {
      index: '04 — SOCIAL MEDIA',
      body: "Building and growing AIVolution's online presence, crafting engaging visual content, and connecting with audiences across platforms.",
    },
  },
  {
    key: 'pr',
    label: 'Public Relations',
    watermark: ['public', 'relations'],
    start: 11.0,
    showAll: 11.8,
    hold: 12.6,
    cluster: 13.2,
    exit: 13.8,
    wmInitialX: 0.35,
    wmTargetX: 0.12,
    wmInitialSize: 0.22,
    wmTargetSize: 0.175,
    wmInitialBase: 0.58,
    wmTargetBase: 0.50,
    summary: {
      index: '05 — PUBLIC RELATIONS',
      body: 'Brand storytellers and media liaisons building corporate sponsorships, community visibility, and inter-collegiate partnerships.',
    },
  },
];

// Cards with initial, all-in-frame, and tightly clustered coordinates
const PLATE_DEFS = [
  // ── 1. CORE TEAM (4 members) ──
  {
    srcIdx: 0, deptIndex: 0, rot: -6, d: 0.38,
    initial: { x: 0.38, y: 0.38, h: 0.38 },
    all: { x: 0.18, y: 0.38, h: 0.32 },
    cluster: { x: 0.32, y: 0.42, h: 0.28 },
  }, // Rahul
  {
    srcIdx: 1, deptIndex: 0, rot: 4, d: 0.12,
    initial: { x: 0.64, y: 0.16, h: 0.36 },
    all: { x: 0.39, y: 0.16, h: 0.32 },
    cluster: { x: 0.43, y: 0.18, h: 0.27 },
  }, // Apoorva
  {
    srcIdx: 2, deptIndex: 0, rot: 7, d: 0.30,
    initial: { x: 0.90, y: 0.30, h: 0.38 },
    all: { x: 0.60, y: 0.40, h: 0.32 },
    cluster: { x: 0.54, y: 0.38, h: 0.28 },
  }, // Naman
  {
    srcIdx: 3, deptIndex: 0, rot: -5, d: 0.20,
    initial: { x: 1.16, y: 0.38, h: 0.38 },
    all: { x: 0.81, y: 0.20, h: 0.32 },
    cluster: { x: 0.65, y: 0.22, h: 0.27 },
  }, // Kshitij

  // ── 2. TECH & DEV (5 members) ──
  {
    srcIdx: 4, deptIndex: 1, rot: -5, d: 0.22,
    initial: { x: 0.30, y: 0.15, h: 0.35 },
    all: { x: 0.16, y: 0.16, h: 0.31 },
    cluster: { x: 0.28, y: 0.19, h: 0.27 },
  }, // Ishan
  {
    srcIdx: 5, deptIndex: 1, rot: 6, d: 0.15,
    initial: { x: 0.54, y: 0.46, h: 0.35 },
    all: { x: 0.32, y: 0.48, h: 0.31 },
    cluster: { x: 0.36, y: 0.45, h: 0.27 },
  }, // Diwakar
  {
    srcIdx: 6, deptIndex: 1, rot: -6, d: 0.30,
    initial: { x: 0.78, y: 0.16, h: 0.35 },
    all: { x: 0.49, y: 0.16, h: 0.31 },
    cluster: { x: 0.44, y: 0.18, h: 0.27 },
  }, // Kriti
  {
    srcIdx: 7, deptIndex: 1, rot: -4, d: 0.18,
    initial: { x: 1.02, y: 0.48, h: 0.35 },
    all: { x: 0.66, y: 0.48, h: 0.31 },
    cluster: { x: 0.51, y: 0.46, h: 0.27 },
  }, // Aparna
  {
    srcIdx: 8, deptIndex: 1, rot: 6, d: 0.20,
    initial: { x: 1.26, y: 0.16, h: 0.35 },
    all: { x: 0.82, y: 0.17, h: 0.31 },
    cluster: { x: 0.58, y: 0.20, h: 0.27 },
  }, // Sumit Bhatt

  // ── 3. EVENT (5 members, including Ashwani Jha) ──
  {
    srcIdx: 9, deptIndex: 2, rot: 5, d: 0.20,
    initial: { x: 0.30, y: 0.15, h: 0.35 },
    all: { x: 0.16, y: 0.16, h: 0.31 },
    cluster: { x: 0.28, y: 0.19, h: 0.27 },
  }, // Parth
  {
    srcIdx: 10, deptIndex: 2, rot: -6, d: 0.28,
    initial: { x: 0.54, y: 0.46, h: 0.35 },
    all: { x: 0.32, y: 0.48, h: 0.31 },
    cluster: { x: 0.36, y: 0.45, h: 0.27 },
  }, // Madhur
  {
    srcIdx: 11, deptIndex: 2, rot: 6, d: 0.15,
    initial: { x: 0.78, y: 0.16, h: 0.35 },
    all: { x: 0.49, y: 0.16, h: 0.31 },
    cluster: { x: 0.44, y: 0.18, h: 0.27 },
  }, // Sumit Kumar
  {
    srcIdx: 12, deptIndex: 2, rot: -5, d: 0.25,
    initial: { x: 1.02, y: 0.48, h: 0.35 },
    all: { x: 0.66, y: 0.48, h: 0.31 },
    cluster: { x: 0.51, y: 0.46, h: 0.27 },
  }, // Kanishka Bhardwaj
  {
    srcIdx: 13, deptIndex: 2, rot: 5, d: 0.22,
    initial: { x: 1.26, y: 0.16, h: 0.35 },
    all: { x: 0.82, y: 0.17, h: 0.31 },
    cluster: { x: 0.58, y: 0.20, h: 0.27 },
  }, // Ashwani Jha

  // ── 4. SOCIAL MEDIA (2 members: Apoorva, Naman) ──
  {
    srcIdx: 14, deptIndex: 3, rot: -5, d: 0.20,
    initial: { x: 0.44, y: 0.20, h: 0.36 },
    all: { x: 0.36, y: 0.22, h: 0.34 },
    cluster: { x: 0.45, y: 0.26, h: 0.28 },
  }, // Apoorva
  {
    srcIdx: 15, deptIndex: 3, rot: 5, d: 0.28,
    initial: { x: 0.72, y: 0.36, h: 0.36 },
    all: { x: 0.60, y: 0.38, h: 0.34 },
    cluster: { x: 0.53, y: 0.32, h: 0.28 },
  }, // Naman

  // ── 5. PR (4 members, including Falak) ──
  {
    srcIdx: 16, deptIndex: 4, rot: 5, d: 0.18,
    initial: { x: 0.32, y: 0.18, h: 0.36 },
    all: { x: 0.18, y: 0.20, h: 0.32 },
    cluster: { x: 0.34, y: 0.22, h: 0.27 },
  }, // Sharad
  {
    srcIdx: 17, deptIndex: 4, rot: -6, d: 0.26,
    initial: { x: 0.58, y: 0.46, h: 0.36 },
    all: { x: 0.38, y: 0.46, h: 0.32 },
    cluster: { x: 0.43, y: 0.44, h: 0.27 },
  }, // Bharti
  {
    srcIdx: 18, deptIndex: 4, rot: 6, d: 0.22,
    initial: { x: 0.84, y: 0.20, h: 0.36 },
    all: { x: 0.58, y: 0.20, h: 0.32 },
    cluster: { x: 0.52, y: 0.24, h: 0.27 },
  }, // Vansh
  {
    srcIdx: 19, deptIndex: 4, rot: -5, d: 0.25,
    initial: { x: 1.10, y: 0.46, h: 0.36 },
    all: { x: 0.78, y: 0.46, h: 0.32 },
    cluster: { x: 0.61, y: 0.42, h: 0.27 },
  }, // Falak
];

// Mathematical smoothing utilities matching reference engine
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const nU = (t) => {
  const e = clamp(t, 0, 1);
  return e * e * e * (e * (6 * e - 15) + 10); // Quintic Perlin smoothstep
};
const lerp = (a, b, t) => a + (b - a) * t;

export const EmulsionTeamGallery = () => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const grainCanvasRef = useRef(null);

  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Read ?scroll= query parameter if present for automated visual tests
  const initialScrollParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('scroll') : null;
  const initScrollX = initialScrollParam ? parseFloat(initialScrollParam) : 0;

  // Continuous Camera Position across the gallery wall
  const cameraRef = useRef({
    currentX: initScrollX,
    targetX: initScrollX,
    maxScroll: 13.5, // Total wall scroll extent covering 5 department chapters
    isDraggingWall: false,
    dragStartX: 0,
    cameraStartX: 0,
  });

  // Track cursor velocity for subtle breeze sway
  const cursorRef = useRef({
    lastX: -9999,
    lastY: -9999,
    velocity: 0,
    isActive: false,
  });

  // Plate state: user drag offsets, pendulum angles, angular velocities
  const platesStateRef = useRef(
    PLATE_DEFS.map((def, i) => ({
      def,
      userOffsetX: 0,
      userOffsetY: 0,
      dragStartOffsetX: 0,
      dragStartOffsetY: 0,
      ang: (def.rot * Math.PI) / 180,
      baseAng: (def.rot * Math.PI) / 180,
      angVel: 0,
      hover: 0,
      isDragging: false,
      dragStartPointerX: 0,
      dragStartPointerY: 0,
      hasMovedSignificantly: false,
      lastMoveX: 0,
      zIndex: 20 + i,
    }))
  );

  const highestZRef = useRef(100);

  // Initialize film grain overlay
  useEffect(() => {
    const grainCanvas = grainCanvasRef.current;
    if (!grainCanvas) return;
    const ctx = grainCanvas.getContext('2d');
    grainCanvas.width = 256;
    grainCanvas.height = 256;
    const imgData = ctx.createImageData(256, 256);
    const buf = new Uint32Array(imgData.data.buffer);
    for (let i = 0; i < buf.length; i++) {
      const v = (Math.random() * 255) | 0;
      buf[i] = (45 << 24) | (v << 16) | (v << 8) | v;
    }
    ctx.putImageData(imgData, 0, 0);
  }, []);

  // Card click to 3D flip
  const handleCardClick = (idx) => {
    const st = platesStateRef.current[idx];
    if (st && st.hasMovedSignificantly) return;
    setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Navigate directly to department
  const navigateToDepartment = useCallback((targetX, idx) => {
    cameraRef.current.targetX = targetX;
    setActiveDeptIdx(idx);
  }, []);

  // Main Animation & Physics Loop
  useEffect(() => {
    let animId;

    const render = () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      const cam = cameraRef.current;
      const cursor = cursorRef.current;

      if (!root) {
        animId = requestAnimationFrame(render);
        return;
      }

      const P = root.clientWidth || window.innerWidth || 1440;
      const j = root.clientHeight || window.innerHeight || 900;

      // Authentic Emulsion continuous smooth camera interpolation (EASE = 0.08)
      const prevX = cam.currentX;
      cam.currentX += (cam.targetX - cam.currentX) * 0.08;
      const scrollVel = (cam.currentX - prevX) * P;

      // Update active navigation indicator based on current department
      const curDept = cam.currentX < 2.3 ? 0 : (cam.currentX < 5.0 ? 1 : (cam.currentX < 7.8 ? 2 : (cam.currentX < 10.6 ? 3 : 4)));
      setActiveDeptIdx(curDept);

      // ── 1. RENDER BACKGROUND WATERMARK CANVAS (Paints synchronously behind photos) ──
      if (canvas) {
        if (canvas.width !== P || canvas.height !== j) {
          canvas.width = P;
          canvas.height = j;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, P, j);

        ctx.fillStyle = THEME.accent;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        for (const dept of DEPARTMENT_CONFIGS) {
          const { start, showAll, cluster, exit } = dept;

          // Watermark visibility window
          if (cam.currentX < start - 0.8 || cam.currentX > exit + 0.3) continue;

          let wmX, wmSize, wmBase, wmAlpha;

          if (cam.currentX < start) {
            // Entering from right as previous department departs
            const p = clamp((cam.currentX - (start - 0.8)) / 0.8, 0, 1);
            const s = nU(p);
            wmX = (dept.wmInitialX + (1 - s) * 0.5) * P;
            wmSize = dept.wmInitialSize * j;
            wmBase = dept.wmInitialBase * j;
            wmAlpha = s * 0.88;
          } else if (cam.currentX <= showAll) {
            // Sliding to center as all cards glide into the frame
            const p = (cam.currentX - start) / (showAll - start);
            const s = nU(p);
            const curX = lerp(dept.wmInitialX, dept.wmTargetX, s);
            const curSize = lerp(dept.wmInitialSize, dept.wmTargetSize, s);
            const curBase = lerp(dept.wmInitialBase, dept.wmTargetBase, s);
            wmX = curX * P;
            wmSize = curSize * j;
            wmBase = curBase * j;
            wmAlpha = 0.88;
          } else if (cam.currentX <= cluster) {
            // Holding centered in background while all cards are showcased and then cluster together
            wmX = dept.wmTargetX * P;
            wmSize = dept.wmTargetSize * j;
            wmBase = dept.wmTargetBase * j;
            wmAlpha = 0.88;
          } else if (cam.currentX <= exit) {
            // Gliding off to the left as next department approaches
            const p = (cam.currentX - cluster) / (exit - cluster);
            const s = nU(p);
            wmX = (dept.wmTargetX - s * 0.95) * P;
            wmSize = dept.wmTargetSize * j;
            wmBase = dept.wmTargetBase * j;
            wmAlpha = (1 - s) * 0.88;
          } else {
            wmAlpha = 0;
          }

          if (wmAlpha > 0.01) {
            ctx.globalAlpha = wmAlpha;
            ctx.font = `400 ${Math.round(wmSize)}px "Playfair Display", Georgia, serif`;
            const lines = Array.isArray(dept.watermark) ? dept.watermark : [dept.watermark];
            const lineGap = wmSize * 0.96;
            const startY = lines.length > 1 ? wmBase - (lines.length - 1) * lineGap * 0.5 : wmBase;

            lines.forEach((line, lIdx) => {
              ctx.fillText(line, Math.round(wmX), Math.round(startY + lIdx * lineGap));
            });
          }
        }
        ctx.globalAlpha = 1;
      }

      // ── 2. ANIMATE HERO & DEPARTMENT SUMMARY COPY BLOCKS ──
      const heroEl = root.querySelector('[data-copy-id="hero"]');
      if (heroEl) {
        // Hero block visible at start, glides off left as user scrolls
        if (cam.currentX <= 0.8) {
          const p = cam.currentX / 0.8;
          const s = nU(p);
          const screenX = (0.05 - s * 0.35) * P;
          const alpha = 1 - s;
          heroEl.style.transform = `translate3d(${Math.round(screenX)}px, ${Math.round(0.24 * j)}px, 0)`;
          heroEl.style.opacity = alpha.toFixed(3);
          heroEl.style.visibility = alpha > 0.01 ? 'visible' : 'hidden';
        } else {
          heroEl.style.opacity = '0';
          heroEl.style.visibility = 'hidden';
        }
      }

      // Department summaries (01 — CORE TEAM, 02 — TECH & DEV, etc.)
      DEPARTMENT_CONFIGS.forEach((dept, dIdx) => {
        const sumEl = root.querySelector(`[data-copy-id="dept-${dIdx}"]`);
        if (!sumEl) return;

        const { start, cluster, exit } = dept;
        let opacity = 0;
        let screenX = 0.05 * P;

        if (cam.currentX >= start - 0.3 && cam.currentX <= exit) {
          if (cam.currentX < start + 0.4) {
            const p = clamp((cam.currentX - (start - 0.3)) / 0.7, 0, 1);
            opacity = nU(p);
            screenX = (0.05 + (1 - opacity) * 0.08) * P;
          } else if (cam.currentX <= cluster) {
            opacity = 1;
            screenX = 0.05 * P;
          } else {
            const p = (cam.currentX - cluster) / (exit - cluster);
            const s = nU(p);
            opacity = 1 - s;
            screenX = (0.05 - s * 0.15) * P;
          }
        }

        sumEl.style.transform = `translate3d(${Math.round(screenX)}px, ${Math.round(0.82 * j)}px, 0)`;
        sumEl.style.opacity = opacity.toFixed(3);
        sumEl.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      });

      // ── 3. ANIMATE PHOTO PLATES (Initial spread -> All cards on screen -> Cluster tightly together -> Exit) ──
      const plateEls = root.querySelectorAll('.emul-plate');
      plateEls.forEach((el, i) => {
        const st = platesStateRef.current[i];
        if (!st) return;

        const def = st.def;
        const dept = DEPARTMENT_CONFIGS[def.deptIndex];
        const { start, showAll, hold, cluster, exit } = dept;

        // Base unscaled card dimensions
        const baseH = (def.initial?.h || 0.35) * j;
        const baseW = baseH * 0.74;
        el.style.width = `${Math.round(baseW)}px`;

        let cardX, cardY, currentScale, currentOpacity;

        if (cam.currentX < start) {
          // Approaching from right
          const dist = start - cam.currentX;
          cardX = def.initial.x + dist * 1.15;
          cardY = def.initial.y;
          currentScale = 1.0;
          currentOpacity = clamp(1 - (dist - 0.4) / 0.6, 0, 1);
        } else if (cam.currentX <= showAll) {
          // Phase 1: All cards slide smoothly into the frame so complete screen shows all cards
          const p = (cam.currentX - start) / (showAll - start);
          const s = nU(p);
          cardX = lerp(def.initial.x, def.all.x, s);
          cardY = lerp(def.initial.y, def.all.y, s);
          const targetScale = def.all.h / def.initial.h;
          currentScale = lerp(1.0, targetScale, s);
          currentOpacity = 1.0;
        } else if (cam.currentX <= hold) {
          // Phase 2: Steady viewing state - all cards framed clearly on screen
          cardX = def.all.x;
          cardY = def.all.y;
          currentScale = def.all.h / def.initial.h;
          currentOpacity = 1.0;
        } else if (cam.currentX <= cluster) {
          // Phase 3: NEXT SCREEN ANE WAALI HAI! Cards compress and cluster tightly together adhering to each other!
          const p = (cam.currentX - hold) / (cluster - hold);
          const s = nU(p);
          cardX = lerp(def.all.x, def.cluster.x, s);
          cardY = lerp(def.all.y, def.cluster.y, s);
          const startScale = def.all.h / def.initial.h;
          const targetScale = def.cluster.h / def.initial.h;
          currentScale = lerp(startScale, targetScale, s);
          currentOpacity = 1.0;
        } else if (cam.currentX <= exit) {
          // Phase 4: Clustered pack glides off smoothly to the left as next department arrives
          const p = (cam.currentX - cluster) / (exit - cluster);
          const s = nU(p);
          cardX = def.cluster.x - s * 1.15;
          cardY = def.cluster.y;
          currentScale = def.cluster.h / def.initial.h;
          currentOpacity = clamp(1 - (s - 0.6) / 0.4, 0, 1);
        } else {
          // Exited left
          const distAfter = cam.currentX - exit;
          cardX = def.cluster.x - 1.15 - distAfter * 1.15;
          cardY = def.cluster.y;
          currentScale = def.cluster.h / def.initial.h;
          currentOpacity = 0;
        }

        // Apply persistent user placement offsets if card was dragged
        cardX += st.userOffsetX;
        cardY += st.userOffsetY;

        const screenX = Math.round(cardX * P);
        const screenY = Math.round(cardY * j);

        // Pendulum Physics: spring force + damping
        if (!st.isDragging) {
          // 1. Breeze sway from cursor brushing past hanging card
          if (cursor.isActive && cursor.velocity > 0.6 && currentOpacity > 0.1) {
            const cardCenterX = screenX + baseW * 0.5;
            const cardCenterY = screenY + baseH * 0.4;
            const cdx = cardCenterX - cursor.lastX;
            const cdy = cardCenterY - cursor.lastY;
            const dist = Math.hypot(cdx, cdy);
            const breezeRadius = 1.6 * baseW;
            if (dist < breezeRadius) {
              const prox = 1 - dist / breezeRadius;
              st.angVel -= Math.sign(cdx) * prox * prox * cursor.velocity * 0.00006;
            }
          }

          // 2. Camera scroll momentum sway
          if (Math.abs(scrollVel) > 0.4) {
            st.angVel += Math.min(0.015, Math.max(-0.015, -scrollVel * 0.00002));
          }

          // 3. Harmonic spring oscillation
          const spring = -0.024 * Math.sin(st.ang - st.baseAng) / (def.d || 0.3);
          const damp = -0.075 * st.angVel;
          st.angVel += spring + damp;
          st.ang += st.angVel;

          // Clamped swing range
          st.ang = Math.max(st.baseAng - 0.45, Math.min(st.baseAng + 0.45, st.ang));

          // Rest snap
          if (Math.abs(st.angVel) < 0.00005 && Math.abs(st.ang - st.baseAng) < 0.00005) {
            st.angVel = 0;
            st.ang = st.baseAng;
          }
        }

        // Hover & drag elevation
        const isHovered = hoveredIdx === i || st.isDragging;
        st.hover += ((isHovered ? 1 : 0) - st.hover) * 0.16;

        // Apply 3D CSS transforms
        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) rotate(${st.ang.toFixed(4)}rad)`;
        el.style.opacity = currentOpacity.toFixed(3);
        el.style.visibility = currentOpacity > 0.01 ? 'visible' : 'hidden';

        const innerEl = el.querySelector('.emul-inner');
        if (innerEl) {
          const liftY = st.isDragging ? -24 : -15 * st.hover;
          const liftScale = st.isDragging ? 1.065 : 1 + 0.045 * st.hover;
          const totalScale = currentScale * liftScale;
          innerEl.style.transform = `translate3d(0, ${liftY.toFixed(1)}px, 0) scale(${totalScale.toFixed(4)})`;
        }

        const cardEl = el.querySelector('.emul-card');
        if (cardEl) {
          if (st.isDragging) {
            cardEl.style.boxShadow = '0 32px 55px -16px rgba(45,30,18,0.52), 0 6px 16px rgba(45,30,18,0.22)';
          } else {
            cardEl.style.boxShadow = st.hover > 0.5 ? THEME.shadowNear : (def.d > 0.22 ? THEME.shadowFar : THEME.shadowNear);
          }
        }
      });

      // Decay cursor velocity
      cursor.velocity *= 0.82;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [hoveredIdx]);

  // Continuous fluid scroll wheel handling
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const cam = cameraRef.current;

      // Natural scroll velocity: continuous subpixel movement across the wall
      const scrollRate = 0.0018;
      cam.targetX = clamp(cam.targetX + delta * scrollRate, 0, cam.maxScroll);
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      const cam = cameraRef.current;
      const curDept = cam.currentX < 2.3 ? 0 : (cam.currentX < 5.0 ? 1 : (cam.currentX < 7.8 ? 2 : (cam.currentX < 10.6 ? 3 : 4)));

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        const nextDept = Math.min(4, curDept + 1);
        cam.targetX = DEPARTMENTS[nextDept].targetX;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        const prevDept = Math.max(0, curDept - 1);
        cam.targetX = DEPARTMENTS[prevDept].targetX;
        e.preventDefault();
      } else if (e.key === 'Home') {
        cam.targetX = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        cam.targetX = 11.0;
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Drag-and-drop & Exhibition Wall Panning handler
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let activeCardIdx = null;

    const onPointerMove = (e) => {
      const rect = root.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (cursorRef.current.lastX > -9000) {
        cursorRef.current.velocity = Math.min(65, Math.hypot(mx - cursorRef.current.lastX, my - cursorRef.current.lastY));
      }
      cursorRef.current.lastX = mx;
      cursorRef.current.lastY = my;
      cursorRef.current.isActive = true;

      const P = root.clientWidth || window.innerWidth || 1440;
      const j = root.clientHeight || window.innerHeight || 900;

      // 1. If dragging an individual card (placeable anywhere on that section)
      if (activeCardIdx !== null && platesStateRef.current[activeCardIdx]) {
        const st = platesStateRef.current[activeCardIdx];
        const dx = e.clientX - st.dragStartPointerX;
        const dy = e.clientY - st.dragStartPointerY;

        if (Math.hypot(dx, dy) > 5) {
          st.hasMovedSignificantly = true;
        }

        st.userOffsetX = st.dragStartOffsetX + (dx / P);
        st.userOffsetY = st.dragStartOffsetY + (dy / j);

        // Dynamic tilt during dragging
        const moveDx = e.clientX - (st.lastMoveX || e.clientX);
        st.ang = st.baseAng + Math.max(-0.25, Math.min(0.25, moveDx * 0.015));
        st.lastMoveX = e.clientX;
        return;
      }

      // 2. If panning the gallery wall
      if (cameraRef.current.isDraggingWall) {
        const deltaPx = e.clientX - cameraRef.current.dragStartX;
        const cam = cameraRef.current;
        cam.targetX = clamp(cam.cameraStartX - (deltaPx / P) * 2.0, 0, cam.maxScroll);
      }
    };

    const onPointerDown = (e) => {
      if (e.target.closest('button, a, input, select')) return;

      const cardEl = e.target.closest('.emul-plate');
      if (cardEl) {
        const idx = parseInt(cardEl.dataset.idx || '-1', 10);
        if (idx >= 0 && platesStateRef.current[idx]) {
          activeCardIdx = idx;
          const st = platesStateRef.current[idx];
          st.isDragging = true;
          st.dragStartPointerX = e.clientX;
          st.dragStartPointerY = e.clientY;
          st.dragStartOffsetX = st.userOffsetX;
          st.dragStartOffsetY = st.userOffsetY;
          st.lastMoveX = e.clientX;
          st.hasMovedSignificantly = false;

          highestZRef.current += 1;
          st.zIndex = highestZRef.current;
          cardEl.style.zIndex = highestZRef.current;
          cardEl.style.cursor = 'grabbing';
          return;
        }
      }

      // Wall pan
      cameraRef.current.isDraggingWall = true;
      cameraRef.current.dragStartX = e.clientX;
      cameraRef.current.cameraStartX = cameraRef.current.targetX;
      root.style.cursor = 'grabbing';
    };

    const onPointerUp = () => {
      if (activeCardIdx !== null && platesStateRef.current[activeCardIdx]) {
        const st = platesStateRef.current[activeCardIdx];
        st.isDragging = false;
        st.angVel += (Math.random() - 0.5) * 0.04; // Gentle settling bounce

        const cardEls = root.querySelectorAll('.emul-plate');
        if (cardEls[activeCardIdx]) {
          cardEls[activeCardIdx].style.cursor = 'grab';
        }
        activeCardIdx = null;
      }

      if (cameraRef.current.isDraggingWall) {
        cameraRef.current.isDraggingWall = false;
        root.style.cursor = 'grab';
      }
    };

    const onPointerLeave = () => {
      cursorRef.current.isActive = false;
      cursorRef.current.lastX = -9999;
      cursorRef.current.lastY = -9999;
      cursorRef.current.velocity = 0;
    };

    root.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    root.addEventListener('pointerleave', onPointerLeave);

    return () => {
      root.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      root.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="emul-root is-ready"
      style={{
        backgroundColor: THEME.wall,
        color: THEME.ink,
        '--emul-ink': THEME.ink,
        '--emul-sub': THEME.sub,
        '--emul-nav': THEME.nav,
        '--emul-hair': THEME.hair,
        '--emul-accent': THEME.accent,
        '--emul-card': THEME.card,
        '--emul-shadow-near': THEME.shadowNear,
        '--emul-shadow-far': THEME.shadowFar,
      }}
      aria-label="AIVolution Exhibition Portfolio Gallery"
    >
      {/* Background Typographic Watermark Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />

      {/* Film Grain Texture Overlay */}
      <canvas
        ref={grainCanvasRef}
        className="pointer-events-none absolute inset-0 z-[90] opacity-[0.08] mix-blend-overlay"
        aria-hidden="true"
      />

      {/* Vignette Warmth Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[91]"
        style={{
          background: 'radial-gradient(125% 105% at 50% 42%, rgba(0,0,0,0) 52%, rgba(74,52,32,0.10) 82%, rgba(58,38,22,0.20) 100%)',
        }}
        aria-hidden="true"
      />

      {/* TOP CHROME: Home link on left, Clean vertical navigation on right */}
      <div className="emul-chrome" style={{ zIndex: 100 }}>
        <Link to="/" className="emul-home" aria-label="Return to Homepage">
          HOME
        </Link>

        {/* Top-Right Department Navigation with active dash */}
        <nav className="emul-nav" aria-label="Gallery Department Navigation">
          {DEPARTMENTS.map((dept, idx) => {
            const isActive = activeDeptIdx === idx;
            return (
              <button
                key={dept.key}
                type="button"
                className={isActive ? 'is-on' : ''}
                onClick={() => navigateToDepartment(dept.targetX, idx)}
              >
                {dept.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom-Right "Scroll to continue" prompt */}
        <div className="emul-scroll">
          <span className="emul-scroll-rule" />
          <span>
            {activeDeptIdx >= 4 ? (
              <>End of<br />the wall</>
            ) : (
              <>Scroll to<br />continue</>
            )}
          </span>
        </div>
      </div>

      {/* TYPOGRAPHIC COPY BLOCKS */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 1. Hero block on opening */}
        <div
          data-copy-id="hero"
          className="emul-copy absolute left-0 top-0 pointer-events-auto"
          style={{ width: 'clamp(280px, 32vw, 480px)' }}
        >
          <div className="emul-mask">
            <div className="emul-eyebrow">AIVOLUTION · 2026</div>
          </div>
          <div className="emul-mask">
            <h2 className="emul-head whitespace-pre-line">Architects of{'\n'}Intelligence</h2>
          </div>
          <div className="emul-mask">
            <div className="emul-rule" />
          </div>
        </div>

        {/* 2. Department chapter summaries unmasking on scroll */}
        {DEPARTMENT_CONFIGS.map((dept, dIdx) => (
          <div
            key={dept.key}
            data-copy-id={`dept-${dIdx}`}
            className="emul-copy absolute left-0 top-0 pointer-events-auto"
            style={{ width: 'clamp(280px, 34vw, 480px)' }}
          >
            <div className="emul-mask">
              <div className="emul-index">{dept.summary.index}</div>
            </div>
            <div className="emul-mask">
              <p className="emul-body">{dept.summary.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* EXHIBITION WALL OF HANGING PHOTOGRAPHIC PLATES */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {PLATE_DEFS.map((def, i) => {
          const member = ORDERED_TEAM[def.srcIdx];
          if (!member) return null;

          const isFlipped = !!flippedCards[i];
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={`${member.name}-${i}`}
              data-idx={i}
              className="emul-plate pointer-events-auto"
              style={{
                zIndex: isHovered || platesStateRef.current[i]?.isDragging ? 999 : (platesStateRef.current[i]?.zIndex || 20 + i),
                touchAction: 'none',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleCardClick(i)}
            >
              <div
                className="emul-inner"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className={`emul-card relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    member.isFoil ? 'border border-[var(--emul-accent)]/30 shadow-xl' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* FRONT FACE OF CARD */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="emul-win" style={{ aspectRatio: 0.75 }}>
                      {member.img ? (
                        <img
                          src={member.img}
                          alt={member.name}
                          loading={i < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#15120F]">
                          <span className="font-display text-4xl font-bold text-white/20">
                            {member.name[0]}
                          </span>
                        </div>
                      )}

                      {/* Signature Emulsion Sliding Chin Caption on Hover */}
                      <div className="emul-chin">
                        <span className="emul-chin-cap">
                          {member.name} <em>· {member.role}</em>
                        </span>
                        <span className="emul-chin-num">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Member Details clearly printed below picture */}
                    <div className="pt-2.5 pb-0.5 px-1 flex flex-col justify-center">
                      <div className="flex items-baseline justify-between w-full gap-2">
                        <h4 className="font-display font-extrabold text-[13px] sm:text-[14px] text-[var(--emul-ink)] tracking-tight truncate m-0">
                          {member.name}
                        </h4>
                        <span className="font-mono text-[9px] text-[var(--emul-sub)] opacity-70 flex-none font-semibold">
                          #{String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                        <p className="font-mono text-[10px] font-semibold text-[var(--emul-accent)] uppercase tracking-wider truncate m-0">
                          {member.role || member.deptLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE OF CARD (Revealed on 3D Flip) */}
                  <div
                    className="absolute inset-0 bg-[#FAF4EA] p-4 flex flex-col justify-between rounded-[2px]"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--emul-hair)]">
                        <span className="font-mono text-[9px] font-bold text-[var(--emul-accent)] tracking-widest uppercase">
                          {member.deptLabel}
                        </span>
                        <span className="font-mono text-[9px] text-[var(--emul-sub)]">
                          #{String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h4 className="font-display text-[15px] font-bold text-[var(--emul-ink)] mt-3">
                        {member.name}
                      </h4>
                      <p className="font-mono text-[10px] text-[var(--emul-accent)] uppercase font-semibold mt-0.5">
                        {member.role}
                      </p>
                      <p className="font-sans text-[11px] text-[var(--emul-sub)] leading-relaxed mt-3">
                        {member.bio || 'Core member driving innovation, research, and technical excellence at AIVolution.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--emul-hair)] flex items-center justify-between text-[9px] font-mono text-[var(--emul-sub)]">
                      <span>Click to flip back</span>
                      <span>·</span>
                      <span>Drag to place</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
