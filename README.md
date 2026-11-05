# Amanda Fonseca — Portfolio

Portfólio pessoal de Amanda Fonseca, desenvolvedora full-stack com foco em frontend e backend.

O projeto reúne trabalhos selecionados, competências técnicas, trajetória acadêmica e experiência profissional em uma interface editorial, responsiva e bilíngue (português e inglês).

## Site publicado

**[Acessar o portfólio](https://amandaafonsecaa.github.io/Portfolio/)**

## Destaques

- Experiência completa em português e inglês
- Projetos em destaque com modal de detalhes, contexto e principais entregas
- Links diretos para repositórios públicos e sites no ar
- Animações sutis, navegação fluida e preferência de redução de movimento respeitada
- Layout responsivo para desktop, tablet e celular
- Currículo disponível para download em português e inglês

## Projetos apresentados

- **UniQuadra** — sistema para reservar quadras esportivas na UNIFOR, com catálogo de modalidades e carteirinha digital. Meu primeiro projeto da faculdade, com back-end em Node.js. [Código no GitHub](https://github.com/Amandaafonsecaa/UniQuadra)
- **FarmingHabit** — app de hábitos com tema de fazenda em pixel art, heatmap de constância, sistema de progressão e sincronização via Supabase. [Código no GitHub](https://github.com/Amandaafonsecaa/FarmingHabit) · [Ver site](https://farming-habit.vercel.app/)
- **PRISMA** — software de pesquisa com testes psicométricos (IAT), desenvolvido com liderança técnica de três desenvolvedoras na UNIFOR. Projeto privado, sem repositório público.

## Tecnologias

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, React Icons
- **Conteúdo e idiomas:** i18next, react-i18next e i18next-http-backend
- **Publicação:** GitHub Pages (GitHub Actions) e Cloudflare Workers para entrega dos assets
- **Projetos citados:** Node.js, NestJS, Supabase e Docker

## Estrutura

```text
src/
  pages/        seções do site: banner, projetos, stack, formação e sobre
  component/    componentes reutilizáveis, como o crachá, o modal e a galeria
  assets/       imagens e ícones importados pelo app
public/
  locales/      traduções em en e pt-BR
  cv/           currículos para download
worker/         Worker que serve os assets estáticos com fallback de SPA
```

## Executando localmente

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

Para verificar o código com ESLint:

```bash
npm run lint
```

## Contato

- [LinkedIn](https://www.linkedin.com/in/amanda-fonseca-b4189426b/)
- [GitHub](https://github.com/Amandaafonsecaa)
- [E-mail](mailto:amandafonsecarod09@gmail.com)

---

Desenvolvido com atenção aos detalhes por **Amanda Fonseca**.
