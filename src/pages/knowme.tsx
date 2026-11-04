import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import type { IconType } from "react-icons";

import RansomTitle from "../component/RansomTitle";
import WatercolorAvatar from "../component/WatercolorAvatar";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay } }),
};

const socials: { href: string; label: string; Icon: IconType }[] = [
  { href: "https://github.com/Amandaafonsecaa", label: "GitHub", Icon: FaGithub },
  { href: "https://www.linkedin.com/in/amanda-fonseca-b4189426b/", label: "LinkedIn", Icon: FaLinkedin },
  { href: "https://wa.me/5588994865035", label: "WhatsApp", Icon: FaWhatsapp },
  { href: "mailto:amandafonsecarod09@gmail.com", label: "E-mail", Icon: MdEmail },
];

export default function KnowMe() {
  const { t } = useTranslation();
  const highlight = (key: string) => <span className="font-medium text-[#ffd230]">{t(key)}</span>;

  return (
    <section id="sobre" className="relative w-full overflow-hidden bg-[#0a0909] pb-24 md:pb-32">
      {/* ONDA: continua o papel da Trajetória */}
      <div className="absolute top-0 left-0 z-0 w-full leading-none">
        <svg className="block w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
          <path
            fill="#fbfbf7"
            d="M0,32L120,58.7C240,85,480,139,720,160C960,181,1200,171,1320,165.3L1440,160L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center justify-items-center lg:justify-items-stretch gap-14 px-6 pt-[clamp(120px,15vw,210px)] lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* TEXTO */}
        <div className="flex min-w-0 flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <RansomTitle text={t("about.title")} />

          <motion.p
            className="max-w-[560px] font-body text-[17px] leading-[1.8] text-white/80 md:text-lg"
            variants={fadeUp}
            custom={0.5}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            {t("about.p1Start")} {highlight("about.p1Highlight")} {t("about.p1End")}
          </motion.p>

          <motion.p
            className="max-w-[560px] font-body text-[17px] leading-[1.8] text-white/80 md:text-lg"
            variants={fadeUp}
            custom={0.6}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            {t("about.p3Start")} {highlight("about.p3Highlight")} {t("about.p3End")}
          </motion.p>

          {/* REDES SOCIAIS */}
          <motion.ul className="flex flex-wrap justify-center gap-3 lg:justify-start" variants={fadeUp} custom={0.7} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <motion.a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-chip"
                  whileHover={{ y: -4, rotate: -4 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </motion.a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* AUTORRETRATO EM AQUARELA */}
        <motion.div variants={fadeUp} custom={0.3} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <WatercolorAvatar label={t("about.avatarLabel")} />
        </motion.div>
      </div>
    </section>
  );
}
