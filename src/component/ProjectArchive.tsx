import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ProjectDetails } from "./ProjectModal";

type Props = {
  projects: ProjectDetails[];
  /** Abre o modal de detalhes do projeto. */
  onOpen: (index: number) => void;
};

const pad = (n: number) => String(n).padStart(2, "0");
// quanto cada folha sobe para fora da pasta (px): fechada só espia, aberta mostra a faixa inteira
const PEEK = 12;
const STRIP = 62;

/**
 * Versão mobile da vitrine: uma pasta de arquivo de papel. A capa fica na
 * frente; as fichas (escuras, como papel de outra gramatura) ficam dentro e
 * espiam pela borda. A pasta abre com o mouse em cima, ao chegar no centro da
 * tela (o "hover" do celular) ou ao tocar na capa: a capa inclina e as fichas
 * sobem em escada, cada uma com print, número e nome. Tocar numa ficha abre o
 * modal do projeto.
 */
export default function ProjectArchive({ projects, onOpen }: Props) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [hover, setHover] = useState(false);
  // toque na capa alterna; null = segue o scroll/hover
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? (hover || inView);
  const total = projects.length;

  return (
    <div
      ref={ref}
      className="pa"
      data-open={open || undefined}
      style={{ ["--pa-rise" as string]: `${STRIP * total + 18}px` }}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHover(false)}
    >
      <ol className="pa-files" aria-label={t("projectsShowcase.archiveLabel")}>
        {projects.map((project, index) => {
          // a primeira ficha é a do fundo, que sobe mais: a escada lê 01, 02, 03 de cima para baixo
          const step = total - index;
          const rise = open ? STRIP * step : PEEK * step;
          return (
            <motion.li
              key={project.key}
              className="pa-file"
              style={{ zIndex: index + 1 }}
              initial={false}
              animate={{ y: -rise, rotate: open ? (index % 2 ? 0.8 : -0.9) : 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : // papel: mola macia e um leve atraso por folha
                    { type: "spring", stiffness: 170, damping: 19, mass: 0.9, delay: open ? index * 0.06 : (total - index) * 0.03 }
              }
            >
              <button type="button" className="pa-file-hit" onClick={() => onOpen(index)}>
                <img src={project.image} alt="" decoding="async" draggable={false} />
                <span className="pa-file-num">N°{pad(index + 1)}</span>
                <span className="pa-file-title">{project.title}</span>
                <span className="pa-file-go" aria-hidden>↗</span>
                <span className="sr-only"> — {t("projectsShowcase.viewProject")}</span>
              </button>
            </motion.li>
          );
        })}
      </ol>

      <motion.button
        type="button"
        className="pa-cover"
        aria-expanded={open}
        aria-label={t("projectsShowcase.archiveLabel")}
        onClick={() => setManual(!open)}
        initial={false}
        animate={reduce ? {} : { rotateX: open ? 14 : 0, y: open ? 6 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <span className="pa-cover-label">
          <span>ARCHIVE:: N°01—{pad(total)}</span>
          <span>A.F.</span>
        </span>
        <span className="pa-cover-num" aria-hidden>{pad(total)}</span>
        <span className="pa-cover-title">{t("projectsShowcase.label")}</span>
        <span className="pa-cover-foot">
          <span className="pa-cover-tag">{total} {t("projectsShowcase.files")}</span>
          <span>{t("projectsShowcase.tapToOpen")}</span>
        </span>
      </motion.button>
    </div>
  );
}
