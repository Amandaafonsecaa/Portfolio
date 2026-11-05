import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import JourneyEntry from "./JourneyEntry";

export type JourneyMilestone = {
  /** Ano de início: define a parada da rota. */
  start: number;
  year: string;
  title: string;
  institution: string;
  description?: string;
  kind: "education" | "work";
};

type Props = {
  milestones: JourneyMilestone[];
  /** Celular: rota estreita à esquerda e descrições que expandem ao toque. */
  compact: boolean;
  labels: { education: string; work: string };
  icons: { education: string; work: string };
};

type Geometry = { w: number; h: number; d: string; stops: number[] };

/**
 * Trajetória como um mapa: uma rota desenhada no papel quadriculado liga os
 * marcos em ordem cronológica. Marcos que começam no mesmo ano dividem a
 * mesma parada (as datas não dizem qual veio antes). A rota passa por um
 * canal reservado e nunca cruza o texto; as posições são medidas no DOM,
 * então ela acompanha qualquer largura e as descrições que expandem.
 */
export default function JourneyMap({ milestones, compact, labels, icons }: Props) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLOListElement>(null);
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry>({ w: 0, h: 0, d: "", stops: [] });
  const [reached, setReached] = useState(0);

  // agrupa por ano de início, em ordem crescente, mantendo a ordem dos dados dentro do ano
  const stops = [...new Set(milestones.map((m) => m.start))]
    .sort((a, b) => a - b)
    .map((start) => ({ start, items: milestones.filter((m) => m.start === start) }));

  // mede os marcadores e monta a rota: Bézier com tangentes verticais, então cada
  // trecho fica entre os x dos dois marcadores, dentro do canal
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const c = el.getBoundingClientRect();
      const pts = markers.current
        .filter((m): m is HTMLSpanElement => !!m)
        .map((m) => {
          const r = m.getBoundingClientRect();
          return { x: r.left + r.width / 2 - c.left, y: r.top + r.height / 2 - c.top };
        });
      if (pts.length < 2) return;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const k = (b.y - a.y) * 0.5;
        d += ` C ${a.x} ${a.y + k} ${b.x} ${b.y - k} ${b.x} ${b.y}`;
      }
      const span = pts[pts.length - 1].y - pts[0].y || 1;
      setGeo({ w: c.width, h: c.height, d, stops: pts.map((p) => (p.y - pts[0].y) / span) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [compact, milestones.length]);

  // o desenho acompanha o scroll: começa quando o 1º marco passa por ~70% da tela
  // e termina quando o último chega lá; rolar para trás apaga naturalmente
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 70%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  useMotionValueEvent(progress, "change", (p) => {
    const count = geo.stops.filter((s) => p >= s - 0.005).length;
    if (count !== reached) setReached(count);
  });
  const lit = reduce ? stops.length : reached;

  return (
    <ol ref={box} className="jm" data-compact={compact || undefined}>
      <svg className="jm-route" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w || 1} ${geo.h || 1}`} aria-hidden>
        {/* traçado a lápis com a rota inteira, e a tinta mostarda por cima, desenhada com o scroll */}
        <path d={geo.d} className="jm-guide" />
        <motion.path d={geo.d} className="jm-ink" style={{ pathLength: reduce ? 1 : progress }} />
      </svg>

      {stops.map((stop, i) => (
        <li
          key={stop.start}
          className="jm-stop"
          data-side={i % 2 ? "left" : "right"}
          data-reached={i < lit || undefined}
          data-current={i === lit - 1 || undefined}
        >
          <span
            ref={(el) => { markers.current[i] = el; }}
            className="jm-marker"
            data-kind={stop.items[0].kind}
            aria-hidden
          />
          <div className="jm-body">
            <p className="jm-year">{stop.start}</p>
            {stop.items.map((item) => (
              <article key={item.title} className="jm-entry">
                <p className="jm-kind">
                  <img src={icons[item.kind]} alt="" />
                  {labels[item.kind]}
                </p>
                {compact ? (
                  <JourneyEntry year={item.year} title={item.title} institution={item.institution} description={item.description} />
                ) : (
                  <>
                    <p className="jm-range">{item.year}</p>
                    <h4 className="jm-title">{item.title}</h4>
                    <p className="jm-inst"><span>{item.institution}</span></p>
                    {item.description && <p className="jm-desc">{item.description}</p>}
                  </>
                )}
              </article>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
