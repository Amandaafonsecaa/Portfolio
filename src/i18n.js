import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../public/locales/en/translation.json';
import ptBR from '../public/locales/pt-BR/translation.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',          // idioma padrão ao abrir
    fallbackLng: 'en',     // se tradução não existir, usa inglês
    interpolation: {
      escapeValue: false   // React já protege contra XSS
    },
    // Bundle both languages so UI labels never depend on a separate HTTP request.
    resources: {
      en: { translation: en },
      'pt-BR': { translation: ptBR }
    }
  });

function syncMetadata() {
  document.documentElement.lang = i18n.resolvedLanguage || i18n.language;
  document.title = i18n.t('metadata.title');
  const description = document.querySelector('meta[name="description"]');
  description?.setAttribute('content', i18n.t('metadata.description'));
}

i18n.on('languageChanged', syncMetadata);
syncMetadata();

export default i18n;
