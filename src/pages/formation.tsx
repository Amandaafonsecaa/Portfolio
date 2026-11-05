import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import JourneyMap, { type JourneyMilestone } from "../component/JourneyMap";
import { useMediaQuery } from "../hooks/useMediaQuery";
import iconAcademic from "../assets/icon/iconAcademic.png";
import iconWork from "../assets/icon/iconWork.png";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Formation() {
  const { t } = useTranslation();
  const present = t("journey.present");
  // celular: rota estreita à esquerda e descrições que expandem ao toque
  const compact = useMediaQuery("(max-width: 767px)");

  // mesmos dados de antes, agora numa lista só; "start" é o ano de início real de cada marco
  const milestones: JourneyMilestone[] = [
    { kind: "education", start: 2023, year: `2023 – ${present}`, title: t("journey.education.degree"), institution: t("journey.education.institution") },
    { kind: "education", start: 2020, year: "2020 – 2023", title: t("journey.highschool.degree"), institution: t("journey.highschool.institution") },
    { kind: "work", start: 2026, year: `2026 – ${present}`, title: t("journey.nexus.title"), institution: t("journey.nexus.institution"), description: t("journey.nexus.description") },
    { kind: "work", start: 2026, year: `2026 – ${present}`, title: t("journey.pet.title"), institution: t("journey.pet.institution"), description: t("journey.pet.description") },
    { kind: "work", start: 2025, year: "2025 – 2026", title: t("journey.cosmos.title"), institution: t("journey.cosmos.institution"), description: t("journey.cosmos.description") },
    { kind: "work", start: 2025, year: "2025", title: t("journey.prisma.title"), institution: t("journey.prisma.institution"), description: t("journey.prisma.description") },
    { kind: "work", start: 2021, year: "2021", title: t("journey.research.title"), institution: t("journey.research.institution"), description: t("journey.research.description") },
  ];

  return (
    <section id="trajetoria" className="journey-paper relative w-full overflow-hidden pt-24 pb-6 md:pt-32 md:pb-10">
      {/* papel quadriculado + margem de caderno */}
      <div aria-hidden="true" className="journey-grid" />
      <div aria-hidden="true" className="journey-margin" />
      {/* desfoque suave no fim da página, preparando a transição para a onda preta.
          O build (lightningcss) descarta o "backdrop-filter" padrão e mantém só o -webkit-,
          então aplicamos os dois via style inline, fora do alcance do minificador de CSS. */}
      <div
        aria-hidden="true"
        className="journey-fade"
        style={{ backdropFilter: "blur(38px)", WebkitBackdropFilter: "blur(38px)" } as CSSProperties}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 md:pl-24">
        {/* Microtítulo */}
        <motion.p
          className="mb-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-[#6b6b6b]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          {t("journey.microTitle")}
        </motion.p>

        {/* Título */}
        <motion.h2
          className="mb-16 w-full max-w-full px-2 text-center font-impact text-[clamp(1.75rem,8.5vw,3rem)] uppercase leading-[1.1] break-words text-[#111] sm:text-5xl md:mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
        >
          {t("journey.titleA")}{" "}
          {/* marca-texto passado à mão; clone repete o traço em cada linha */}
          <motion.span
            className="bg-[linear-gradient(rgba(255,210,48,0.8),rgba(255,210,48,0.8))] bg-no-repeat px-[0.12em] font-title font-normal normal-case italic tracking-normal [background-position:0_88%] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
            initial={{ backgroundSize: "0% 0.42em" }}
            whileInView={{ backgroundSize: "100% 0.42em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.45 }}
          >
            {t("journey.titleB")} <br /> {t("journey.titleC")}
          </motion.span>{" "}
          {t("journey.titleD")}
        </motion.h2>

        {/* mapa: uma rota ligando formação e experiência em ordem cronológica */}
        <JourneyMap
          milestones={milestones}
          compact={compact}
          labels={{ education: t("journey.educationLabel"), work: t("journey.workLabel") }}
          icons={{ education: iconAcademic, work: iconWork }}
        />
      </div>
    </section>
  );
}
