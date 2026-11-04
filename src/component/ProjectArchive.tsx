import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ProjectDetails } from "./ProjectModal";

type Props = {
  projects: ProjectDetails[];
  /** Abre o modal de detalhes do projeto. */
  onOpen: (index: number) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Versão mobile da vitrine: uma pasta de arquivo com uma ficha por projeto.
 * As abas são um tablist de verdade (toque, setas, Home/End); a ficha ativa
 * vem para a frente e as outras ficam como folhas atrás dela. O detalhe
 * completo continua no modal, aberto por "View project".
 */
export default function ProjectArchive({ projects, onOpen }: Props) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  // direção da troca: a ficha nova sai de trás e a antiga desce para trás dela
  const [direction, setDirection] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = projects[active];
  const total = projects.length;

  const select = (index: number, focus = false) => {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    setActive(index);
    if (focus) tabs.current[index]?.focus();
  };

  // padrão de tabs do WAI-ARIA: setas trocam de ficha, Home/End vão às pontas
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % total,
      ArrowLeft: (active - 1 + total) % total,
      Home: 0,
      End: total - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], true);
  };

  return (
    <div className="pa">
      <div className="pa-folder" aria-hidden>
        <span className="pa-folder-tab">{t("projectsShowcase.archiveLabel")}</span>
      </div>

      <div className="pa-tabs" role="tablist" aria-label={t("projectsShowcase.archiveLabel")} onKeyDown={onKeyDown}>
        {projects.map((item, index) => (
          <button
            key={item.key}
            ref={(el) => { tabs.current[index] = el; }}
            type="button"
            role="tab"
            id={`pa-tab-${item.key}`}
            aria-selected={index === active}
            aria-controls="pa-panel"
            tabIndex={index === active ? 0 : -1}
            className="pa-tab"
            onClick={() => select(index)}
          >
            <span className="pa-tab-num">{pad(index + 1)}</span>
            <span className="pa-tab-name">{item.title}</span>
          </button>
        ))}
      </div>

      <div className="pa-stack">
        {/* as outras fichas, vistas pela borda atrás da ativa */}
        <span className="pa-leaf pa-leaf--1" aria-hidden />
        <span className="pa-leaf pa-leaf--2" aria-hidden />

        <div id="pa-panel" role="tabpanel" aria-labelledby={`pa-tab-${project.key}`} className="pa-panel">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.article
              key={project.key}
              className="pa-sheet"
              custom={direction}
              // a ficha inteira se move como um objeto só, nada de animar peça por peça
              variants={{
                enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, y: -22, rotate: d * 0.8 }),
                center: { opacity: 1, y: 0, rotate: 0 },
                exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, y: 26, rotate: d * -1.2, zIndex: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0.15 : 0.42, ease }}
            >
              <p className="pa-meta">
                <span>{t("projectsShowcase.file")} {pad(active + 1)}</span>
                <span>{pad(active + 1)} / {pad(total)}</span>
              </p>
              <figure className="pa-shot"><img src={project.image} alt="" decoding="async" /></figure>
              <h3>{project.title}</h3>
              {/* reserva a altura do resumo mais longo, para a ficha não pular ao trocar */}
              <div className="pa-summary">
                {projects.map((item) => (
                  <p key={item.key} aria-hidden={item.key !== project.key} className={item.key === project.key ? undefined : "pa-ghost"}>
                    {t(`projects.${item.key}.category`)}
                  </p>
                ))}
              </div>
              <div className="pa-actions">
                <button type="button" className="pa-open" onClick={() => onOpen(active)}>
                  {t("projectsShowcase.viewProject")}<span aria-hidden> →</span>
                  <span className="sr-only"> — {project.title}</span>
                </button>
                <span className="pa-links">
                  {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">{t("projectsShowcase.liveShort")}<span aria-hidden> ↗</span><span className="sr-only"> — {project.title}</span></a>}
                  {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer">{t("projectsShowcase.githubShort")}<span aria-hidden> ↗</span><span className="sr-only"> — {project.title}</span></a>}
                  {!project.repo && !project.live && <span className="pa-private">{t("projectsShowcase.privateShort")}</span>}
                </span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
