export interface JourneyItem {
  year: string;
  title: string;
  institution: string;
  description?: string;
}

// folha de papel opaca sobre o quadriculado: o fundo nunca disputa com o texto
export default function JourneyCard({ year, title, institution, description }: JourneyItem) {
  return (
    <article className="group relative rounded-xl border border-black/6 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_30px_-14px_rgba(20,30,60,0.25)] transition duration-300 ease-out hover:-translate-y-1 hover:-rotate-[0.6deg] hover:shadow-[0_2px_0_rgba(0,0,0,0.04),0_22px_40px_-16px_rgba(20,30,60,0.35)]">
      {/* fita adesiva que "prende" a folha no hover */}
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 bg-[#ffd230]/65 opacity-0 shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
      <p className="font-hand text-lg leading-none text-[#9a7400]">{year}</p>
      <h4 className="mt-2 font-body text-[17px] font-semibold leading-snug text-[#111]">{title}</h4>
      <p className="mt-1 font-body text-sm font-semibold text-[#2a2a2a]">
        <span className="bg-[linear-gradient(transparent_55%,rgba(255,210,48,0.55)_55%)] px-0.5">{institution}</span>
      </p>
      {description && <p className="mt-2 font-body text-sm leading-relaxed text-[#4a4a4a]">{description}</p>}
    </article>
  );
}
