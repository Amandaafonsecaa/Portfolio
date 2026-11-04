import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiExternalLink, FiGithub, FiLock } from "react-icons/fi";
import type { ProjectDetails } from "./ProjectModal";

type Props = {
  projects: ProjectDetails[];
  /** Abre o modal de detalhes do projeto. */
  onOpen: (index: number) => void;
};

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/**
 * Versão mobile da vitrine: cards enxutos e empilhados no lugar do carrossel.
 * O card inteiro abre os detalhes (botão "esticado" sobre ele), e os
 * links de código e site ficam por cima, como alvos de toque próprios.
 */
export default function ProjectStack({ projects, onOpen }: Props) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.ul
      className="project-stack"
      aria-label={t("projectsShowcase.galleryLabel")}
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {projects.map((project, index) => {
        const titleId = `project-stack-${project.key}`;
        return (
          <motion.li key={project.key} variants={item}>
            <article className="project-tile" aria-labelledby={titleId}>
              <div className="project-tile-media">
                <img src={project.image} alt="" loading="lazy" decoding="async" />
              </div>

              <div className="project-tile-body">
                <p className="project-tile-eyebrow"><i aria-hidden />{t(`projects.${project.key}.context`)}</p>
                <h3 id={titleId}>{project.title}</h3>
                {/* só o resumo; descrição completa, destaques e stack ficam no modal */}
                <p className="project-tile-text">{t(`projects.${project.key}.category`)}</p>

                <div className="project-tile-footer">
                  <button type="button" className="project-tile-open" onClick={() => onOpen(index)}>
                    {t("projectsShowcase.details")} <FiArrowRight aria-hidden />
                    <span className="sr-only"> — {project.title}</span>
                  </button>

                  <div className="project-tile-links">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`${t("projectsShowcase.live")} — ${project.title}`}>
                        <FiExternalLink aria-hidden />
                      </a>
                    )}
                    {project.repo && (
                      <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`${t("projectsShowcase.github")} — ${project.title}`}>
                        <FiGithub aria-hidden />
                      </a>
                    )}
                    {!project.repo && !project.live && (
                      <span className="project-tile-private" title={t("projectsShowcase.private")}>
                        <FiLock aria-hidden /><span className="sr-only">{t("projectsShowcase.private")}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
