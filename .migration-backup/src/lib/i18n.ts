export type Locale = "ru" | "en";

const translations = {
  ru: {
    "nav.features": "Возможности",
    "nav.pricing": "Тарифы",
    "nav.login": "Войти",
    "nav.start": "Начать бесплатно",
    "hero.title": "Создавайте сайты без кода",
    "hero.subtitle":
      "Constructor — визуальный конструктор с drag-and-drop, глубокой настройкой стилей и визуальным программированием.",
    "hero.cta": "Начать бесплатно",
    "hero.demo": "Попробовать в деле",
    "dashboard.title": "Мои проекты",
    "dashboard.new": "Новый проект",
    "dashboard.empty": "У вас пока нет проектов",
    "editor.save": "Сохранить",
    "editor.publish": "Опубликовать",
    "editor.undo": "Отменить",
    "editor.redo": "Повторить",
    "settings.title": "Настройки",
    "settings.language": "Язык интерфейса",
    "settings.theme": "Тема оформления",
    "settings.theme.light": "Светлая",
    "settings.theme.dark": "Тёмная",
    "settings.theme.system": "Системная",
    "settings.autosave": "Автосохранение",
    "settings.grid": "Сетка на холсте",
    "settings.snap": "Привязка к сетке",
  },
  en: {
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.login": "Sign in",
    "nav.start": "Start for free",
    "hero.title": "Build websites without code",
    "hero.subtitle":
      "Constructor — visual builder with drag-and-drop, deep styling, and block-based scripting.",
    "hero.cta": "Start for free",
    "hero.demo": "Try it live",
    "dashboard.title": "My projects",
    "dashboard.new": "New project",
    "dashboard.empty": "You have no projects yet",
    "editor.save": "Save",
    "editor.publish": "Publish",
    "editor.undo": "Undo",
    "editor.redo": "Redo",
    "settings.title": "Settings",
    "settings.language": "Interface language",
    "settings.theme": "Theme",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.theme.system": "System",
    "settings.autosave": "Autosave",
    "settings.grid": "Canvas grid",
    "settings.snap": "Snap to grid",
  },
} as const;

export type TranslationKey = keyof typeof translations.ru;

export function t(key: TranslationKey, locale: Locale = "ru"): string {
  return translations[locale][key] || translations.ru[key] || key;
}
