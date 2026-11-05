import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Versão mobile de uma entrada da trajetória: escrita direto no papel
 * quadriculado, sem card. Data, cargo e instituição ficam sempre à vista; a
 * descrição abre e fecha com um toque (só quando existe descrição).
 */
type Props = { year: string; title: string; institution: string; description?: string };

export default function JourneyEntry({ year, title, institution, description }: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const heading = (
    <>
      <span className="je-year">{year}</span>
      <span className="je-title">{title}</span>
      <span className="je-inst"><span>{institution}</span></span>
    </>
  );

  if (!description) return <div className="je je--static">{heading}</div>;

  return (
    <div className="je" data-open={open || undefined}>
      <button type="button" className="je-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        {heading}
        {/* sinal de "+" feito à mão, que vira "–" quando a nota está aberta */}
        <span className="je-sign" aria-hidden><i /><i /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="je-note"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p><span aria-hidden>↳ </span>{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
