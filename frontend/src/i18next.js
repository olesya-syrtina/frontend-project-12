import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ruTranslation from './locales/ru'

export default async function initI18n() {
  await i18n
    .use(initReactI18next)
    .init({
      resources: { ru: { translation: ruTranslation } },
      lng: 'ru',
      fallbackLng: 'ru',
      interpolation: { escapeValue: false },
    })
  return i18n
}
