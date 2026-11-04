import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// instância única, para outros componentes (ex.: o modal) pausarem a rolagem
let instance: Lenis | null = null;
export const getLenis = () => instance;

/**
 * Rolagem suave da página com Lenis. Por baixo continua sendo o scroll
 * nativo, então `useScroll`/`whileInView` do Framer seguem funcionando.
 * Quem pede menos movimento no sistema fica com o scroll padrão.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      // links "#secao" do menu também deslizam
      anchors: true,
      // quanto menor, mais "macio" (padrão 0.1)
      lerp: 0.085,
      wheelMultiplier: 0.95,
    });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);
}
