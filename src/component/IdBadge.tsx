import { useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useTranslation } from "react-i18next";

import photo from "../assets/foto-amarelo.jpeg";
import {
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  CARD_W,
  RING,
  STEP,
  TOP,
  buildRig,
  cardWeights,
  nearestRopePoint,
  nudge,
  step,
  type Grab,
  type Rig,
} from "./badgePhysics";

const STRAP_TEXT = "AMANDA FONSECA ✦ ".repeat(14);
// passos seguidos quase parados antes de o sistema "dormir"
const SLEEP_AFTER = 90;

export default function IdBadge() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const strapId = `strap-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [flipped, setFlipped] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const strapPath = useRef<SVGPathElement>(null);
  const clip = useRef<SVGGElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const tiltLayer = useRef<HTMLDivElement>(null);

  const rig = useRef<Rig | null>(null);
  const grab = useRef<Grab | null>(null);
  const press = useRef({ x: 0, y: 0, time: 0 });
  const awake = useRef(true);

  // simulação: passo fixo, render direto no DOM (sem re-render do React)
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let frame = 0;
    let last = performance.now();
    let acc = 0;
    let still = 0;
    let tilt = 0;
    let visible = true;
    let size = { w: 0, h: 0 };

    const render = (system: Rig) => {
      const p = system.points;
      // fita: curva suave pelos pontos médios
      let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
      for (let i = 1; i < RING; i++) {
        const mx = (p[i].x + p[i + 1].x) / 2;
        const my = (p[i].y + p[i + 1].y) / 2;
        d += ` Q${p[i].x.toFixed(1)},${p[i].y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
      }
      d += ` L${p[RING].x.toFixed(1)},${p[RING].y.toFixed(1)}`;
      strapPath.current?.setAttribute("d", d);

      // presilha alinhada entre o anel e o topo do crachá
      const clipAngle = (Math.atan2(p[TOP].y - p[RING].y, p[TOP].x - p[RING].x) * 180) / Math.PI - 90;
      clip.current?.setAttribute("transform", `translate(${p[RING].x} ${p[RING].y}) rotate(${clipAngle}) scale(${system.scale})`);

      // crachá: posição e ângulo saem do triângulo rígido
      const angle = Math.atan2(p[BOTTOM_RIGHT].y - p[BOTTOM_LEFT].y, p[BOTTOM_RIGHT].x - p[BOTTOM_LEFT].x);
      if (card.current) {
        card.current.style.transform = `translate(${p[TOP].x}px, ${p[TOP].y}px) rotate(${angle}rad) scale(${system.scale}) translate(${-CARD_W / 2}px, 0)`;
      }

      // inclinação 3D proporcional à velocidade lateral
      const vx = (p[BOTTOM_LEFT].x - p[BOTTOM_LEFT].px + p[BOTTOM_RIGHT].x - p[BOTTOM_RIGHT].px) / 2;
      tilt += (Math.max(-30, Math.min(30, vx * 2.2)) - tilt) * 0.15;
      if (tiltLayer.current) tiltLayer.current.style.transform = `perspective(1100px) rotateY(${tilt.toFixed(2)}deg)`;
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const system = rig.current;
      const elapsed = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (!system || !visible || !awake.current) return;
      acc += elapsed;
      while (acc >= STEP) {
        const fastest = step(system, grab.current);
        acc -= STEP;
        still = !grab.current && fastest < 0.02 ? still + 1 : 0;
      }
      if (still > SLEEP_AFTER) awake.current = false;
      render(system);
    };

    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (Math.abs(width - size.w) < 2 && Math.abs(height - size.h) < 2) return;
      // primeira medida: queda; redimensionamentos depois: já pendurado
      const first = size.w === 0;
      size = { w: width, h: height };
      rig.current = buildRig(width, height, first && !reduceMotion);
      awake.current = true;
      render(rig.current);
    });
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });

    resize.observe(el);
    viewport.observe(el);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      viewport.disconnect();
    };
  }, [reduceMotion]);

  const local = (event: PointerEvent) => {
    const rect = stage.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startCardDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!rig.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = local(event);
    grab.current = { kind: "card", weights: cardWeights(rig.current, x, y), x, y };
    press.current = { x: event.clientX, y: event.clientY, time: performance.now() };
    awake.current = true;
  };

  const startStrapDrag = (event: PointerEvent<SVGPathElement>) => {
    if (!rig.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = local(event);
    grab.current = { kind: "rope", index: nearestRopePoint(rig.current, x, y), x, y };
    awake.current = true;
  };

  const moveDrag = (event: PointerEvent) => {
    if (!grab.current) return;
    const { x, y } = local(event);
    grab.current.x = x;
    grab.current.y = y;
  };

  const endCardDrag = (event: PointerEvent) => {
    grab.current = null;
    // toque curto e parado conta como clique: vira o crachá
    const moved = Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y);
    if (moved < 6 && performance.now() - press.current.time < 350) setFlipped((value) => !value);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setFlipped((value) => !value);
    } else if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && rig.current) {
      event.preventDefault();
      nudge(rig.current, event.key === "ArrowLeft" ? -10 : 10);
      awake.current = true;
    }
  };

  return (
    <div ref={stage} className="badge-stage relative select-none">
      {/* FITA + ANEL + PRESILHA */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${strapId}-metal`} x1="0" x2="1">
            <stop offset="0" stopColor="#8f8f8f" />
            <stop offset="0.45" stopColor="#ececec" />
            <stop offset="1" stopColor="#a5a5a5" />
          </linearGradient>
          {/* a fita "nasce" com fade no ponto de fixação */}
          <linearGradient id={`${strapId}-fade`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="70">
            <stop offset="0" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id={`${strapId}-mask`} maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="6000" height="6000">
            <rect x="-3000" y="-3000" width="6000" height="6000" fill={`url(#${strapId}-fade)`} />
          </mask>
        </defs>
        <g mask={`url(#${strapId}-mask)`}>
          <path
            ref={strapPath}
            id={strapId}
            fill="none"
            stroke="#ffd230"
            strokeWidth={28}
            className="cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={startStrapDrag}
            onPointerMove={moveDrag}
            onPointerUp={() => (grab.current = null)}
            onPointerCancel={() => (grab.current = null)}
          />
          <text className="pointer-events-none font-impact text-[10px] tracking-[0.35em]" fill="rgba(10,9,9,0.7)" dominantBaseline="central">
            <textPath href={`#${strapId}`}>{STRAP_TEXT}</textPath>
          </text>
        </g>
        <g ref={clip}>
          <circle r={9} fill="none" stroke="#c9c9c9" strokeWidth={3.5} />
          <rect x={-7} y={7} width={14} height={34} rx={2.5} fill={`url(#${strapId}-metal)`} stroke="rgba(0,0,0,0.25)" strokeWidth={0.75} />
        </g>
      </svg>

      {/* CRACHÁ */}
      <div
        ref={card}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={t("badge.ariaLabel")}
        className="absolute top-0 left-0 h-105 w-70 origin-top-left cursor-grab touch-none rounded-[20px] outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ffd230] active:cursor-grabbing"
        onPointerDown={startCardDrag}
        onPointerMove={moveDrag}
        onPointerUp={endCardDrag}
        onPointerCancel={() => (grab.current = null)}
        onKeyDown={handleKeyDown}
      >
        <div ref={tiltLayer} className="h-full w-full transform-3d">
          <div
            className="relative h-full w-full rounded-[20px] transform-3d transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
          >
            {/* FRENTE */}
            <div
              aria-hidden={flipped}
              className="absolute inset-0 flex flex-col items-center overflow-hidden rounded-[20px] border border-black/5 bg-white px-6 pt-4 text-center text-[#111] shadow-[0_30px_70px_rgba(0,0,0,0.22)] backface-hidden"
            >
              <span aria-hidden="true" className="h-2 w-12 rounded-full bg-[#111]/12" />
              <p className="mt-4 font-body text-[17px] font-extrabold tracking-[-0.08em]">
                AF<span className="text-[#e5b900]">.</span>
              </p>
              <div className="mt-4 h-[200px] w-[164px] overflow-hidden rounded-lg bg-[#e5e0d4]">
                <img
                  src={photo}
                  alt={t("about.photoAlt")}
                  draggable={false}
                  className="h-full w-full object-cover scale-[1.75] origin-[53%_30%]"
                />
              </div>
              <p className="mt-6 font-body text-[22px] font-bold leading-none tracking-[-0.03em]">{t("badge.name")}</p>
              <span aria-hidden="true" className="mt-3 h-[2px] w-8 bg-[#ffd230]" />
              <p className="mt-3 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-[#666]">{t("badge.role")}</p>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3 bg-[#ffd230]" />
            </div>

            {/* VERSO */}
            <div
              aria-hidden={!flipped}
              className="absolute inset-0 flex flex-col items-center rounded-[20px] bg-[#111] px-7 pt-4 pb-6 text-center text-white shadow-[0_30px_70px_rgba(0,0,0,0.3)] backface-hidden transform-[rotateY(180deg)]"
            >
              <span aria-hidden="true" className="h-2 w-12 rounded-full bg-white/15" />
              <div className="flex flex-1 items-center justify-center py-8">
                <p className="font-hand text-[2.5rem] leading-[1.15] text-balance text-[#ffd230]">{t("badge.motto")}</p>
              </div>
              <div
                aria-hidden="true"
                className="mt-auto h-8 w-full opacity-60 [background:repeating-linear-gradient(90deg,#fff_0_2px,transparent_2px_5px,#fff_5px_6px,transparent_6px_9px)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
