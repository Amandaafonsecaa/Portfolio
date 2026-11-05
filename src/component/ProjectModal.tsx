import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { getLenis } from "../hooks/useSmoothScroll";

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

export default function ProjectModal({ projects, index, onChange }: Props) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  // no celular/tablet o modal vira uma gaveta que sobe de baixo e fecha arrastando
  const sheet = useMediaQuery("(max-width: 900px)");
  const drag = useDragControls();
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
    getLenis()?.stop();
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      getLenis()?.start();
      document.body.style.paddingRight = paddingRight;
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  // Os controles persistem ao trocar de projeto; se o conteúdo focado saiu, volta ao fechar.
  useEffect(() => {
    if (open && panelRef.current && !panelRef.current.contains(document.activeElement)) {
      closeRef.current?.focus({ preventScroll: true });
    }
  }, [index, open]);

  // teclado: Esc fecha, setas trocam de projeto, Tab fica preso dentro do modal
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onChange(null);
      else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        go(event.key === "ArrowRight" ? 1 : -1);
      }
      else if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
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

  const contributions = project
    ? (t(`projects.${project.key}.highlights`, { returnObjects: true }) as unknown)
    : [];
  const pad = (n: number) => String(n).padStart(2, "0");
  const prev = index === null ? null : projects[(index - 1 + total) % total];
  const next = index === null ? null : projects[(index + 1) % total];

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
            // o conteúdo do modal rola nativo, fora do Lenis
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : sheet ? { y: "100%" } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : sheet ? { y: "100%" } : { opacity: 0, y: 16 }}
            transition={{ duration: sheet ? 0.45 : 0.5, ease }}
            onClick={(event) => event.stopPropagation()}
            // no celular, arrasto só pela alça, para não brigar com a rolagem do conteúdo
            drag={sheet && !reduce ? "y" : false}
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onChange(null);
            }}
          >
            {sheet && <div className="pm-handle" onPointerDown={(event) => drag.start(event)} aria-hidden><span /></div>}

            <motion.article
              className="pm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* cabeçalho: índice, título e links como texto, sem pílulas */}
              <header className="pm-head">
                <span className="pm-index" aria-hidden>{pad(index! + 1)}<small>/{pad(total)}</small></span>
                <h3 id="project-modal-title">{project.title}</h3>
                <nav className="pm-links" aria-label={project.title}>
                  {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">{t("projectsShowcase.liveShort")}<span aria-hidden> ↗</span></a>}
                  {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer">{t("projectsShowcase.githubShort")}<span aria-hidden> ↗</span></a>}
                  {!project.live && !project.repo && <span className="pm-muted">{t("projectsShowcase.privateShort")}</span>}
                </nav>
                <button ref={closeRef} type="button" className="pm-close" onClick={() => onChange(null)} aria-label={t("projectsShowcase.close")}>
                  <span aria-hidden>✕</span>
                </button>
              </header>

              <motion.div
                key={project.key}
                className="pm-body"
                tabIndex={sheet ? 0 : undefined}
                role={sheet ? "region" : undefined}
                aria-labelledby={sheet ? "project-modal-title" : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
              >
                {/* o print abre a coluna larga, na proporção original e com altura limitada; prints altos rolam dentro da janela */}
                <figure className="pm-shot" tabIndex={0} aria-label={project.title}>
                  <img
                    src={project.image}
                    alt=""
                    // print mais alto que largo (página inteira): vira uma janela rolável em vez de encolher
                    onLoad={(event) => {
                      const img = event.currentTarget;
                      if (img.naturalHeight > img.naturalWidth * 1.2) img.parentElement?.setAttribute("data-tall", "");
                    }}
                  />
                </figure>

                {/* ficha técnica logo abaixo do print, em colunas curtas */}
                <dl className="pm-facts">
                  <div><dt>{t("projectsShowcase.role")}</dt><dd>{t(`projects.${project.key}.role`)}</dd></div>
                  <div><dt>{t("projectsShowcase.context")}</dt><dd>{t(`projects.${project.key}.context`)}</dd></div>
                  <div><dt>{t("projectsShowcase.stack")}</dt><dd>{project.tags.join(", ")}</dd></div>
                </dl>

                <div className="pm-text">
                  <p className="pm-lede">{t(`projects.${project.key}.details`)}</p>
                  {Array.isArray(contributions) && contributions.length > 0 && (
                    <section aria-labelledby="pm-contrib">
                      <h4 id="pm-contrib">{t("projectsShowcase.contributions")}</h4>
                      <ol className="pm-list">
                        {contributions.map((item: string, i: number) => <li key={item}><span aria-hidden>{pad(i + 1)}</span>{item}</li>)}
                      </ol>
                    </section>
                  )}
                </div>
              </motion.div>

              {/* navegação editorial: nomes dos vizinhos, não só setas */}
              {total > 1 && prev && next && (
                <footer className="pm-nav">
                  <button type="button" onClick={() => go(-1)} aria-label={`${t("projectsShowcase.previous")}: ${prev.title}`}>
                    <span aria-hidden>←</span> <span className="pm-nav-name">{prev.title}</span>
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label={`${t("projectsShowcase.next")}: ${next.title}`}>
                    <span className="pm-nav-name">{next.title}</span> <span aria-hidden>→</span>
                  </button>
                </footer>
              )}
            </motion.article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
