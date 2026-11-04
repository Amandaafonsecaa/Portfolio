import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheck, FiLock, FiX } from "react-icons/fi";

export type ProjectDetails = {
  key: string;
  title: string;
  image: string;
  tags: string[];
  repo: string | null;
  /** Site publicado; null quando o projeto não está no ar. */
  live: string | null;
};

type Props = {
  projects: ProjectDetails[];
  /** Índice do projeto aberto; null fecha o modal. */
  index: number | null;
  onChange: (index: number | null) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

// conteúdo entra em cascata, depois do painel
const content: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function ProjectModal({ projects, index, onChange }: Props) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const project = open ? projects[index] : null;
  const total = projects.length;

  const go = (step: number) => {
    if (index === null) return;
    onChange((index + step + total) % total);
  };

  // trava o scroll da página, foca o botão de fechar e devolve o foco ao sair
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  // teclado: Esc fecha, setas trocam de projeto, Tab fica preso dentro do modal
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onChange(null);
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const highlights = project
    ? (t(`projects.${project.key}.highlights`, { returnObjects: true }) as unknown)
    : [];

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal"
          className="project-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onChange(null)}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="project-modal"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.55, ease }}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={closeRef} type="button" className="project-modal-close" onClick={() => onChange(null)} aria-label={t("projectsShowcase.close")}>
              <FiX aria-hidden />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.key}
                className="project-modal-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="project-modal-media">
                  {/* fundo: a própria imagem desfocada preenche as sobras do contain */}
                  <img src={project.image} alt="" aria-hidden className="project-modal-ambient" />
                  <motion.img
                    src={project.image}
                    alt=""
                    initial={reduce ? false : { scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.1, ease }}
                  />
                  <span className="project-modal-count">
                    {String(index! + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </div>

                <motion.div className="project-modal-body" variants={content} initial="hidden" animate="show">
                  <motion.p variants={rise} className="project-modal-eyebrow">
                    <i aria-hidden />
                    {t(`projects.${project.key}.context`)}
                  </motion.p>
                  <motion.h3 variants={rise} id="project-modal-title">{project.title}</motion.h3>

                  <motion.div variants={rise} className="project-modal-section">
                    <h4>{t("projectsShowcase.about")}</h4>
                    <p>{t(`projects.${project.key}.details`)}</p>
                  </motion.div>

                  {Array.isArray(highlights) && highlights.length > 0 && (
                    <motion.div variants={rise} className="project-modal-section">
                      <h4>{t("projectsShowcase.highlights")}</h4>
                      <ul className="project-modal-highlights">
                        {highlights.map((item: string) => (
                          <li key={item}><span aria-hidden><FiCheck /></span>{item}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  <motion.div variants={rise} className="project-modal-section">
                    <h4>{t("projectsShowcase.stack")}</h4>
                    <ul className="project-modal-tags">
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </motion.div>

                  <motion.div variants={rise} className="project-modal-footer">
                    <div className="project-modal-actions">
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-modal-cta">
                          {t("projectsShowcase.live")} <FiArrowUpRight aria-hidden />
                        </a>
                      )}
                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={project.live ? "project-modal-cta project-modal-cta--ghost" : "project-modal-cta"}
                        >
                          {t("projectsShowcase.github")} <FiArrowUpRight aria-hidden />
                        </a>
                      ) : !project.live && (
                        <span className="project-modal-private"><FiLock aria-hidden /> {t("projectsShowcase.private")}</span>
                      )}
                    </div>
                    {total > 1 && (
                      <div className="project-modal-nav">
                        <button type="button" onClick={() => go(-1)} aria-label={t("projectsShowcase.previous")}><FiArrowLeft aria-hidden /></button>
                        <button type="button" onClick={() => go(1)} aria-label={t("projectsShowcase.next")}><FiArrowRight aria-hidden /></button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
