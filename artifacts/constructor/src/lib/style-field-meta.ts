export interface StyleFieldMeta {
  label: string;
  hint: string;
  placeholder?: string;
  unit?: string;
  type?: "text" | "select" | "color";
  options?: { value: string; label: string }[];
  presets?: string[];
}

export const STYLE_FIELD_META: Record<string, StyleFieldMeta> = {
  width: {
    label: "Ширина",
    hint: "Ширина блока. Примеры: 100%, 320px, auto",
    placeholder: "100%",
    presets: ["auto", "100%", "50%", "fit-content", "100vw", "320px", "480px", "768px", "1200px"],
  },
  height: {
    label: "Высота",
    hint: "Высота блока. Примеры: auto, 200px, 100vh",
    placeholder: "auto",
    presets: ["auto", "100%", "100vh", "50vh", "200px", "400px", "600px", "fit-content"],
  },
  minWidth: { label: "Мин. ширина", hint: "Минимальная ширина", placeholder: "0", presets: ["0", "200px", "320px", "480px"] },
  maxWidth: { label: "Макс. ширина", hint: "Максимальная ширина", placeholder: "1200px", presets: ["none", "640px", "768px", "1024px", "1200px", "1440px"] },
  minHeight: { label: "Мин. высота", hint: "Минимальная высота", placeholder: "0", presets: ["0", "100px", "200px", "100vh"] },
  maxHeight: { label: "Макс. высота", hint: "Максимальная высота", placeholder: "none", presets: ["none", "200px", "400px", "100vh"] },
  margin: {
    label: "Внешний отступ (все стороны)",
    hint: "Отступ снаружи элемента. Пример: 16px или 10px 20px",
    placeholder: "0",
  },
  marginTop: { label: "Отступ сверху", hint: "Внешний отступ сверху", placeholder: "0" },
  marginRight: { label: "Отступ справа", hint: "Внешний отступ справа", placeholder: "0" },
  marginBottom: { label: "Отступ снизу", hint: "Внешний отступ снизу", placeholder: "0" },
  marginLeft: { label: "Отступ слева", hint: "Внешний отступ слева", placeholder: "0" },
  padding: {
    label: "Внутренний отступ (все стороны)",
    hint: "Пространство внутри блока. Пример: 24px",
    placeholder: "0",
    presets: ["0", "4px", "8px", "12px", "16px", "24px", "32px", "48px"],
  },
  paddingTop: { label: "Внутр. отступ сверху", hint: "Padding сверху", placeholder: "0" },
  paddingRight: { label: "Внутр. отступ справа", hint: "Padding справа", placeholder: "0" },
  paddingBottom: { label: "Внутр. отступ снизу", hint: "Padding снизу", placeholder: "0" },
  paddingLeft: { label: "Внутр. отступ слева", hint: "Padding слева", placeholder: "0" },
  backgroundColor: {
    label: "Цвет фона",
    hint: "Цвет заливки блока",
    placeholder: "#ffffff",
    type: "color",
  },
  background: {
    label: "Фон (сокращённо)",
    hint: "Любое CSS-значение background",
    placeholder: "#f8fafc",
  },
  backgroundImage: {
    label: "Фоновое изображение",
    hint: "URL картинки в формате url(...)",
    placeholder: "url(https://...)",
  },
  backgroundSize: {
    label: "Размер фона",
    hint: "Как масштабировать фоновую картинку",
    type: "select",
    options: [
      { value: "cover", label: "cover — заполнить" },
      { value: "contain", label: "contain — вписать" },
      { value: "auto", label: "auto" },
    ],
  },
  backgroundPosition: {
    label: "Позиция фона",
    hint: "Смещение фонового изображения",
    placeholder: "center",
  },
  color: {
    label: "Цвет текста",
    hint: "Цвет шрифта",
    placeholder: "#171717",
    type: "color",
  },
  fontFamily: {
    label: "Шрифт",
    hint: "Семейство шрифтов",
    type: "select",
    options: [
      { value: "system-ui, sans-serif", label: "Системный" },
      { value: "Georgia, serif", label: "Georgia" },
      { value: "'Courier New', monospace", label: "Моноширинный" },
    ],
  },
  fontSize: {
    label: "Размер шрифта",
    hint: "Размер текста",
    placeholder: "16px",
    presets: ["12px", "14px", "16px", "18px", "20px", "24px", "32px", "40px", "48px", "64px"],
  },
  fontWeight: {
    label: "Жирность",
    hint: "Толщина шрифта",
    type: "select",
    options: [
      { value: "400", label: "Обычный (400)" },
      { value: "500", label: "Средний (500)" },
      { value: "600", label: "Полужирный (600)" },
      { value: "700", label: "Жирный (700)" },
    ],
  },
  fontStyle: {
    label: "Стиль шрифта",
    type: "select",
    options: [
      { value: "normal", label: "Обычный" },
      { value: "italic", label: "Курсив" },
    ],
    hint: "Наклон текста",
  },
  lineHeight: {
    label: "Межстрочный интервал",
    hint: "Высота строки. Пример: 1.5 или 24px",
    placeholder: "1.5",
  },
  letterSpacing: {
    label: "Межбуквенный интервал",
    hint: "Расстояние между буквами",
    placeholder: "normal",
  },
  textAlign: {
    label: "Выравнивание текста",
    hint: "Горизонтальное выравнивание",
    type: "select",
    options: [
      { value: "left", label: "Слева" },
      { value: "center", label: "По центру" },
      { value: "right", label: "Справа" },
      { value: "justify", label: "По ширине" },
    ],
  },
  textDecoration: {
    label: "Подчёркивание",
    type: "select",
    options: [
      { value: "none", label: "Нет" },
      { value: "underline", label: "Подчёркнутый" },
      { value: "line-through", label: "Зачёркнутый" },
    ],
    hint: "Декорация текста",
  },
  textShadow: {
    label: "Тень текста",
    hint: "Пример: 1px 1px 2px rgba(0,0,0,0.2)",
    placeholder: "none",
  },
  border: {
    label: "Граница (все стороны)",
    hint: "Пример: 1px solid #e2e8f0",
    placeholder: "none",
  },
  borderWidth: { label: "Толщина границы", hint: "Толщина рамки", placeholder: "1px" },
  borderStyle: {
    label: "Стиль границы",
    type: "select",
    options: [
      { value: "solid", label: "Сплошная" },
      { value: "dashed", label: "Пунктир" },
      { value: "dotted", label: "Точки" },
      { value: "none", label: "Нет" },
    ],
    hint: "Тип линии рамки",
  },
  borderColor: {
    label: "Цвет границы",
    hint: "Цвет рамки",
    placeholder: "#e2e8f0",
    type: "color",
  },
  borderRadius: {
    label: "Скругление углов",
    hint: "Радиус всех углов. Пример: 8px",
    placeholder: "0",
    presets: ["0", "4px", "6px", "8px", "12px", "16px", "24px", "50%", "9999px"],
  },
  borderTopLeftRadius: { label: "Скругление ↖", hint: "Левый верхний угол", placeholder: "0" },
  borderTopRightRadius: { label: "Скругление ↗", hint: "Правый верхний угол", placeholder: "0" },
  borderBottomLeftRadius: { label: "Скругление ↙", hint: "Левый нижний угол", placeholder: "0" },
  borderBottomRightRadius: { label: "Скругление ↘", hint: "Правый нижний угол", placeholder: "0" },
  display: {
    label: "Тип отображения",
    type: "select",
    options: [
      { value: "block", label: "block" },
      { value: "flex", label: "flex" },
      { value: "grid", label: "grid" },
      { value: "inline-block", label: "inline-block" },
      { value: "none", label: "none — скрыть" },
    ],
    hint: "Как элемент участвует в вёрстке",
  },
  flexDirection: {
    label: "Направление flex",
    type: "select",
    options: [
      { value: "row", label: "В ряд →" },
      { value: "column", label: "В колонку ↓" },
      { value: "row-reverse", label: "Ряд ←" },
      { value: "column-reverse", label: "Колонка ↑" },
    ],
    hint: "Для display: flex",
  },
  flexWrap: {
    label: "Перенос flex",
    type: "select",
    options: [
      { value: "nowrap", label: "Без переноса" },
      { value: "wrap", label: "С переносом" },
    ],
    hint: "Переносить ли элементы на новую строку",
  },
  justifyContent: {
    label: "Выравнивание по главной оси",
    type: "select",
    options: [
      { value: "flex-start", label: "В начале" },
      { value: "center", label: "По центру" },
      { value: "flex-end", label: "В конце" },
      { value: "space-between", label: "space-between" },
      { value: "space-around", label: "space-around" },
    ],
    hint: "Горизонтально для row, вертикально для column",
  },
  alignItems: {
    label: "Выравнивание по поперечной оси",
    type: "select",
    options: [
      { value: "stretch", label: "Растянуть" },
      { value: "flex-start", label: "В начале" },
      { value: "center", label: "По центру" },
      { value: "flex-end", label: "В конце" },
    ],
    hint: "Для flex-контейнера",
  },
  gap: { label: "Зазор (gap)", hint: "Расстояние между дочерними элементами", placeholder: "8px", presets: ["0", "4px", "8px", "12px", "16px", "24px", "32px"] },
  gridTemplateColumns: {
    label: "Колонки grid",
    hint: "Пример: 1fr 1fr или repeat(3, 1fr)",
    placeholder: "1fr 1fr",
  },
  gridTemplateRows: {
    label: "Строки grid",
    hint: "Пример: auto 1fr auto",
    placeholder: "auto",
  },
  top: { label: "Сверху (top)", hint: "Для absolute/fixed", placeholder: "0" },
  left: { label: "Слева (left)", hint: "Для absolute/fixed", placeholder: "0" },
  right: { label: "Справа (right)", hint: "Для absolute/fixed", placeholder: "auto" },
  bottom: { label: "Снизу (bottom)", hint: "Для absolute/fixed", placeholder: "auto" },
  zIndex: { label: "Слой (z-index)", hint: "Чем больше — тем выше над другими", placeholder: "1" },
  boxShadow: {
    label: "Тень блока",
    hint: "Пример: 0 4px 12px rgba(0,0,0,0.1)",
    placeholder: "none",
  },
  opacity: {
    label: "Прозрачность",
    hint: "От 0 (невидим) до 1 (полностью видим)",
    placeholder: "1",
    presets: ["0", "0.25", "0.5", "0.75", "1"],
  },
  filter: { label: "Фильтр", hint: "Пример: blur(4px)", placeholder: "none" },
  backdropFilter: { label: "Размытие фона", hint: "Пример: blur(8px)", placeholder: "none" },
  transform: { label: "Трансформация", hint: "Пример: rotate(5deg) scale(1.05)", placeholder: "none" },
  transition: {
    label: "Переход",
    hint: "Пример: all 0.3s ease",
    placeholder: "none",
  },
  animation: { label: "Анимация", hint: "Имя CSS-анимации", placeholder: "none" },
  animationDuration: { label: "Длительность анимации", hint: "Пример: 0.5s", placeholder: "1s" },
  animationDelay: { label: "Задержка анимации", hint: "Пример: 0.2s", placeholder: "0s" },
  cursor: {
    label: "Курсор",
    type: "select",
    options: [
      { value: "default", label: "Обычный" },
      { value: "pointer", label: "Рука (клик)" },
      { value: "text", label: "Текст" },
      { value: "move", label: "Перемещение" },
    ],
    hint: "Вид курсора при наведении",
  },
  overflow: {
    label: "Переполнение",
    type: "select",
    options: [
      { value: "visible", label: "visible" },
      { value: "hidden", label: "hidden — обрезать" },
      { value: "auto", label: "auto — скролл" },
      { value: "scroll", label: "scroll" },
    ],
    hint: "Если контент не помещается",
  },
};

export const POSITION_MODE_HINTS: Record<string, string> = {
  relative: "Обычный поток, можно сдвигать top/left",
  absolute: "Позиция относительно родителя, свободное перемещение",
  fixed: "Фиксация к окну браузера",
  flex: "Flex-элемент внутри flex-контейнера",
  grid: "Элемент сетки grid",
};
