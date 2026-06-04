/** Подробные инструкции для панели свойств */
export const STYLE_GUIDES: Record<
  string,
  { title: string; guide: string; examples: string[] }
> = {
  width: {
    title: "Ширина (width)",
    guide:
      "Задаёт, насколько широким будет блок. Можно в пикселях (точный размер), в процентах (от родителя) или auto — подстроится под содержимое.",
    examples: ["100%", "320px", "50vw", "auto", "min(400px, 100%)"],
  },
  height: {
    title: "Высота (height)",
    guide:
      "Высота блока. auto — по содержимому; фиксированная в px — стабильная высота; vh — доля экрана.",
    examples: ["auto", "200px", "100vh", "min-height: 400px"],
  },
  margin: {
    title: "Внешние отступы (margin)",
    guide:
      "Пустое пространство снаружи элемента — отталкивает соседей. Один параметр — со всех сторон; четыре — top right bottom left.",
    examples: ["0", "16px", "10px 20px", "8px 16px 24px 16px"],
  },
  padding: {
    title: "Внутренние отступы (padding)",
    guide:
      "Отступ внутри блока между рамкой и текстом/кнопкой. Увеличивает «воздух» внутри карточек и кнопок.",
    examples: ["0", "12px 24px", "16px", "8px 16px 8px 16px"],
  },
  backgroundColor: {
    title: "Цвет фона",
    guide: "Заливка фона элемента. HEX (#fff), rgb() или названия (transparent).",
    examples: ["#ffffff", "#0c8ce9", "rgba(0,0,0,0.5)", "transparent"],
  },
  color: {
    title: "Цвет текста",
    guide: "Цвет шрифта внутри блока. Для кнопок и заголовков задайте контрастный цвет к фону.",
    examples: ["#171717", "#ffffff", "#0c8ce9", "inherit"],
  },
  fontSize: {
    title: "Размер шрифта",
    guide: "Крупность текста. rem масштабируется с настройками браузера; px — фиксированно.",
    examples: ["16px", "1.125rem", "24px", "clamp(14px, 2vw, 18px)"],
  },
  borderRadius: {
    title: "Скругление углов",
    guide: "Насколько закруглены углы. 50% на квадрате даст круг; 8–16px — современные карточки.",
    examples: ["0", "8px", "16px", "9999px", "12px 12px 0 0"],
  },
  display: {
    title: "Тип отображения (display)",
    guide:
      "block — колонка; flex — гибкая раскладка детей; grid — сетка; none — скрыть элемент полностью.",
    examples: ["block", "flex", "grid", "inline-block", "none"],
  },
  flexDirection: {
    title: "Направление Flex",
    guide: "row — элементы в ряд слева направо; column — столбик сверху вниз.",
    examples: ["row", "column", "row-reverse", "column-reverse"],
  },
  justifyContent: {
    title: "Выравнивание по главной оси",
    guide: "Как распределить дочерние элементы вдоль направления flex (горизонтально для row).",
    examples: ["flex-start", "center", "flex-end", "space-between", "space-around"],
  },
  alignItems: {
    title: "Выравнивание по поперечной оси",
    guide: "Вертикальное выравнивание детей в flex-контейнере (при flex-direction: row).",
    examples: ["stretch", "center", "flex-start", "flex-end"],
  },
  gap: {
    title: "Зазор между элементами (gap)",
    guide: "Расстояние между дочерними блоками в flex или grid без отдельных margin.",
    examples: ["8px", "16px", "1rem", "24px 12px"],
  },
  position: {
    title: "Позиция (через режим в панели)",
    guide:
      "relative — обычный поток; absolute — свободно на странице относительно родителя; fixed — к окну браузера.",
    examples: ["Используйте кнопки relative / absolute / fixed выше"],
  },
  top: {
    title: "Смещение сверху (top)",
    guide: "Работает с absolute/fixed. Отступ от верхнего края родителя.",
    examples: ["0", "20px", "10%", "auto"],
  },
  left: {
    title: "Смещение слева (left)",
    guide: "Горизонтальная позиция при absolute/fixed.",
    examples: ["0", "50%", "24px", "auto"],
  },
  boxShadow: {
    title: "Тень блока",
    guide: "Формат: смещениеX смещениеY размытие цвет. Несколько теней через запятую.",
    examples: [
      "0 4px 12px rgba(0,0,0,0.1)",
      "0 2px 4px #00000020",
      "none",
    ],
  },
  opacity: {
    title: "Прозрачность",
    guide: "0 — полностью прозрачный, 1 — непрозрачный. Можно анимировать через блоки.",
    examples: ["1", "0.5", "0", "0.85"],
  },
  overflow: {
    title: "Переполнение",
    guide:
      "hidden — обрезать лишнее (текст не вылезет); auto — скролл при переполнении.",
    examples: ["visible", "hidden", "auto", "scroll"],
  },
  transition: {
    title: "Плавный переход",
    guide: "Анимирует смену стилей. all 0.3s ease — плавно всё за 0.3 сек.",
    examples: ["all 0.3s ease", "opacity 0.2s", "transform 0.4s cubic-bezier(0.4,0,0.2,1)"],
  },
  zIndex: {
    title: "Слой (z-index)",
    guide: "Чем больше число — тем выше элемент над другими. Для модалок и шапок: 10–1000.",
    examples: ["1", "10", "100", "auto"],
  },
};

export function getStyleGuide(key: string) {
  return (
    STYLE_GUIDES[key] ?? {
      title: key,
      guide:
        "CSS-свойство в camelCase. Значение пишется как в обычном CSS. Оставьте пустым, чтобы не менять.",
      examples: ["—"],
    }
  );
}
