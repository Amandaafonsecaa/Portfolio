import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import IdBadge from "../component/IdBadge";
import Typewriter from "../component/Typewriter";

export default function Banner() {
  const { t, i18n } = useTranslation();
  const { scrollYProgress } = useScroll();
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const isEN = i18n.language.startsWith("en");
  // o currículo baixado acompanha o idioma do site
  const cvUrl = `${import.meta.env.BASE_URL}cv/${isEN ? "cv_amanda_en.pdf" : "Amanda_Fonseca_Curriculo.pdf"}`;
  const cvName = isEN ? "Amanda_Fonseca_CV.pdf" : "Amanda_Fonseca_Curriculo.pdf";

  return (
    <section id="inicio" className="hero-shell">
      <div className="hero-glow" />
      <nav className="topbar" aria-label={t("nav.primaryLabel")}>
        <a href="#inicio" className="brand" aria-label={t("nav.homeLabel")}>AF<span>.</span></a>
        <div className="nav-links"><a href="#projetos">{t("nav.projects")}</a><a href="#expertise">{t("nav.expertise")}</a><a href="#trajetoria">{t("nav.journey")}</a><a href="#sobre">{t("nav.about")}</a></div>
        <div className="language-pill" role="group" aria-label={t("nav.languageLabel")}>
          <button type="button" aria-pressed={!isEN} className={!isEN ? "active" : ""} onClick={() => i18n.changeLanguage("pt-BR")}>PT</button>
          <span aria-hidden="true" />
          <button type="button" aria-pressed={isEN} className={isEN ? "active" : ""} onClick={() => i18n.changeLanguage("en")}>EN</button>
        </div>
      </nav>
      <div className="hero-copy">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }} className="eyebrow">{t("portfolioHero.eyebrow")}</motion.p>
        <motion.h1 style={{ y: titleY }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>{t("portfolioHero.line1")}<br />{t("portfolioHero.line2")} <em><Typewriter key={i18n.language} words={t("portfolioHero.rotating", { returnObjects: true }) as string[]} /></em></motion.h1>
        <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65, duration: .7 }}>{t("portfolioHero.description")}</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}><a className="primary-action" href="#projetos">{t("portfolioHero.projectsCta")} <span>↘</span></a><a className="secondary-action" href={cvUrl} download={cvName}>{t("portfolioHero.cvCta")}</a></motion.div>
      </div>
      <div className="hero-badge"><IdBadge /></div>
    </section>
  );
}
