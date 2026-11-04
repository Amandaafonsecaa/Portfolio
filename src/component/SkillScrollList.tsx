import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";

export type SkillItem = { label: string; category: string };

/**
 * Versão touch da expertise: sem mouse não há spotlight nem ímã, então o
 * próprio scroll vira a interação. Cada linha "acende" ao cruzar o centro
 * da tela (texto claro, número e traço amarelos) e apaga ao sair.
 */
export default function SkillScrollList({ skills }: { skills: SkillItem[] }) {
  return (
    <ol className="skill-scroll">
      {skills.map((skill, index) => <SkillRow key={skill.label} skill={skill} index={index} />)}
    </ol>
  );
}

function SkillRow({ skill, index }: { skill: SkillItem; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // 0 quando a linha entra por baixo, 1 quando sai por cima; o centro da tela fica em ~0.5
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const focus = useTransform(scrollYProgress, [0.34, 0.46, 0.54, 0.66], [0, 1, 1, 0]);

  // fonte única: o scroll grava --lit na linha e o CSS deriva texto, número, traço e deslocamento
  // (se cada parte usasse um motion value, o Framer aceleraria a opacidade pelo navegador e o
  // resto por JS, e eles sairiam de sincronia)
  useMotionValueEvent(focus, "change", (value) => {
    ref.current?.style.setProperty("--lit", reduce ? "1" : value.toFixed(3));
  });

  const number = String(index + 1).padStart(2, "0");
  return (
    <motion.li
      ref={ref}
      className="skill-row"
      style={{ "--lit": reduce ? 1 : 0 } as CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="skill-row-index" aria-hidden>{number}<span>{number}</span></span>
      {/* duas camadas do mesmo texto: a apagada embaixo e a acesa por cima */}
      <span className="skill-row-name">{skill.label}<span aria-hidden>{skill.label}</span></span>
      <span className="skill-row-category">{skill.category}</span>
      <i className="skill-row-line" aria-hidden />
    </motion.li>
  );
}
