import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import TiltedGridHero, { type TiltedGridProject } from "../component/TiltedGridHero";
import ProjectModal, { type ProjectDetails } from "../component/ProjectModal";
import farmingHabitImg from "../assets/FarminHabit.png";
import prismaImg from "../assets/prisma-fullscreen.png";
import uniquadraImg from "../assets/uniquadra.png";

const projects: ProjectDetails[] = [
  { title: "UniQuadra", key: "uniquadra", image: uniquadraImg, tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Node.js"], repo: "https://github.com/Amandaafonsecaa/UniQuadra", live: null },
  { title: "FarmingHabit", key: "farminghabit", image: farmingHabitImg, tags: ["React 19", "Tailwind CSS v4", "NestJS", "Swagger", "Supabase Auth/Sync", "Docker"], repo: "https://github.com/Amandaafonsecaa/FarmingHabit", live: "https://farming-habit.vercel.app/" },
  { title: "PRISMA", key: "prisma", image: prismaImg, tags: ["Full-stack", "Tech Lead", "User Research"], repo: null, live: null },
];

export default function Projects() {
  const { t } = useTranslation();
  // projeto aberto no modal de detalhes
  const [selected, setSelected] = useState<number | null>(null);
  const items: TiltedGridProject[] = projects.map((project) => ({
    src: project.image,
    title: project.title,
    description: t(`projects.${project.key}.category`),
    tags: project.tags,
    href: project.repo,
    live: project.live,
  }));

  return <section id="projetos" className="projects-section">
    <div className="projects-heading"><span className="section-index">02 — {t("projectsShowcase.label")}</span><h2>{t("projectsShowcase.title1")}<br /><em>{t("projectsShowcase.title2")}</em></h2></div>
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8 }}>
      <TiltedGridHero items={items} linkLabel={t("projectsShowcase.github")} liveLabel={t("projectsShowcase.live")} privateLabel={t("projectsShowcase.private")} onOpen={setSelected} tileHeight={44} axis={50} className="h-[340px] w-full sm:h-[460px]" />
      {/* a faixa é decorativa (aria-hidden); leitores de tela e teclado abrem os detalhes por esta lista */}
      <ul className="sr-only" aria-label={t("projectsShowcase.galleryLabel")}>
        {projects.map((project, index) => <li key={project.key}><button type="button" onClick={() => setSelected(index)}>{project.title} — {t("projectsShowcase.details")}</button></li>)}
      </ul>
    </motion.div>
    <ProjectModal projects={projects} index={selected} onChange={setSelected} />
  </section>;
}
