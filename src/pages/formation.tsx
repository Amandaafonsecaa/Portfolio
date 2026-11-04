import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { JourneyItem } from "../component/JourneyCard";
import JourneyTimeline from "../component/JourneyTimeline";
import iconAcademic from "../assets/icon/iconAcademic.png";
import iconWork from "../assets/icon/iconWork.png";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Formation() {
  const { t } = useTranslation();
  const present = t("journey.present");

  const educationData: JourneyItem[] = [
    {
      year: `2023 – ${present}`,
      title: t("journey.education.degree"),
      institution: t("journey.education.institution"),
      description: t("journey.education.description"),
    },
    {
      year: "2020 – 2023",
      title: t("journey.highschool.degree"),
      institution: t("journey.highschool.institution"),
      description: t("journey.highschool.description"),
    },
  ];

  const workData: JourneyItem[] = [
    {
      year: `2026 – ${present}`,
      title: t("journey.nexus.title"),
      institution: t("journey.nexus.institution"),
      description: t("journey.nexus.description"),
    },
    {
      year: `2026 – ${present}`,
      title: t("journey.pet.title"),
      institution: t("journey.pet.institution"),
      description: t("journey.pet.description"),
    },
    {
      year: "2025 – 2026",
      title: t("journey.cosmos.title"),
      institution: t("journey.cosmos.institution"),
      description: t("journey.cosmos.description"),
    },
    {
      year: "2025",
      title: t("journey.prisma.title"),
      institution: t("journey.prisma.institution"),
      description: t("journey.prisma.description"),
    },
    {
      year: "2021 – 2022",
      title: t("journey.research.title"),
      institution: t("journey.research.institution"),
      description: t("journey.research.description"),
    },
  ];

  return (
    <section id="trajetoria" className="journey-paper relative w-full overflow-hidden pt-24 pb-6 md:pt-32 md:pb-10">
      {/* papel quadriculado + margem de caderno */}
      <div aria-hidden="true" className="journey-grid" />
      <div aria-hidden="true" className="journey-margin" />

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

        {/* Colunas */}
        <div className="flex w-full flex-col items-start gap-14 md:flex-row md:gap-12">
          <JourneyTimeline label={t("journey.educationLabel")} icon={iconAcademic} items={educationData} />
          <JourneyTimeline label={t("journey.workLabel")} icon={iconWork} items={workData} />
        </div>
      </div>
    </section>
  );
}
