import type { BlockDefinition } from "@/types/editor";

/** Блоки для страницы (клиентские скрипты) */
export const CLIENT_BLOCK_DEFINITIONS: BlockDefinition[] = [
  { type: "on_click", label: "При клике", category: "trigger", color: "#f59e0b", fields: [{ key: "elementId", label: "Элемент (ID)", type: "text" }], outputs: 1 },
  { type: "on_hover", label: "При наведении", category: "trigger", color: "#f59e0b", fields: [{ key: "elementId", label: "Элемент", type: "text" }], outputs: 1 },
  { type: "on_load", label: "Загрузка страницы", category: "trigger", color: "#f59e0b", outputs: 1 },
  { type: "on_submit", label: "Отправка формы", category: "trigger", color: "#f59e0b", fields: [{ key: "elementId", label: "Форма", type: "text" }], outputs: 1 },
  {
    type: "on_keypress",
    label: "Нажатие клавиши",
    category: "trigger",
    color: "#f59e0b",
    fields: [
      { key: "key", label: "Клавиша", type: "select", defaultValue: "Enter", options: [
        { value: "Enter", label: "Enter" }, { value: "Escape", label: "Escape" },
        { value: " ", label: "Пробел" }, { value: "ArrowUp", label: "↑" },
        { value: "ArrowDown", label: "↓" }, { value: "a", label: "A" },
      ]},
    ],
    outputs: 1,
  },
  { type: "on_double_click", label: "Двойной клик", category: "trigger", color: "#f59e0b", fields: [{ key: "elementId", label: "Элемент", type: "text" }], outputs: 1 },
  { type: "set_color", label: "Цвет текста", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "color", label: "Цвет", type: "color", defaultValue: "#0c8ce9" }], inputs: 1, outputs: 1 },
  { type: "set_background", label: "Фон элемента", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "color", label: "Цвет", type: "color", defaultValue: "#f1f5f9" }], inputs: 1, outputs: 1 },
  { type: "set_size", label: "Размер (ширина/высота)", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "width", label: "Ширина", type: "text", defaultValue: "100%" }, { key: "height", label: "Высота", type: "text", defaultValue: "auto" }], inputs: 1, outputs: 1 },
  { type: "set_style", label: "Любое CSS-свойство", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "property", label: "Свойство", type: "text", defaultValue: "opacity" }, { key: "value", label: "Значение", type: "text", defaultValue: "1" }], inputs: 1, outputs: 1 },
  { type: "set_opacity", label: "Прозрачность", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "opacity", label: "0–1", type: "text", defaultValue: "0.5" }], inputs: 1, outputs: 1 },
  { type: "show_element", label: "Показать", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }], inputs: 1, outputs: 1 },
  { type: "hide_element", label: "Скрыть", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }], inputs: 1, outputs: 1 },
  { type: "set_text", label: "Изменить текст", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "text", label: "Текст", type: "textarea" }], inputs: 1, outputs: 1 },
  { type: "toggle_class", label: "Переключить класс", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "className", label: "Класс", type: "text" }], inputs: 1, outputs: 1 },
  { type: "animate_style", label: "Плавно изменить", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }, { key: "property", label: "Свойство", type: "text", defaultValue: "opacity" }, { key: "value", label: "Конечное", type: "text", defaultValue: "1" }, { key: "duration", label: "мс", type: "number", defaultValue: "300" }], inputs: 1, outputs: 1 },
  { type: "scroll_to", label: "Прокрутить к", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Элемент", type: "text" }], inputs: 1, outputs: 1 },
  { type: "navigate", label: "Перейти по URL", category: "action", color: "#3b82f6", fields: [{ key: "url", label: "URL", type: "text" }, { key: "target", label: "Вкладка", type: "select", defaultValue: "_self", options: [{ value: "_self", label: "Текущая" }, { value: "_blank", label: "Новая" }] }], inputs: 1, outputs: 1 },
  { type: "alert", label: "Alert", category: "action", color: "#3b82f6", fields: [{ key: "message", label: "Текст", type: "textarea" }], inputs: 1, outputs: 1 },
  { type: "get_input_value", label: "Прочитать поле", category: "action", color: "#3b82f6", fields: [{ key: "elementId", label: "Поле", type: "text" }, { key: "variable", label: "В переменную", type: "text", defaultValue: "inputVal" }], inputs: 1, outputs: 1 },
  {
    type: "if_condition",
    label: "Если / иначе",
    category: "condition",
    color: "#8b5cf6",
    fields: [
      { key: "left", label: "Левое", type: "text", defaultValue: "true" },
      { key: "operator", label: "Оператор", type: "select", defaultValue: "==", options: [
        { value: "==", label: "равно" }, { value: "!=", label: "не равно" },
        { value: ">", label: ">" }, { value: "<", label: "<" },
        { value: ">=", label: ">=" }, { value: "<=", label: "<=" },
        { value: "includes", label: "содержит" },
      ]},
      { key: "right", label: "Правое", type: "text", defaultValue: "false" },
    ],
    inputs: 1,
    outputs: 2,
  },
  { type: "compare_vars", label: "Сравнить переменные", category: "condition", color: "#8b5cf6", fields: [{ key: "varA", label: "Переменная A", type: "text" }, { key: "operator", label: "Оператор", type: "select", defaultValue: "==", options: [{ value: "==", label: "==" }, { value: "!=", label: "!=" }, { value: ">", label: ">" }, { value: "<", label: "<" }] }, { key: "varB", label: "Переменная B", type: "text" }], inputs: 1, outputs: 2 },
  { type: "repeat", label: "Повторить N раз", category: "loop", color: "#10b981", fields: [{ key: "count", label: "Раз", type: "number", defaultValue: "3" }], inputs: 1, outputs: 1 },
  { type: "while_loop", label: "Пока условие", category: "loop", color: "#10b981", fields: [{ key: "condition", label: "Условие (JS)", type: "text", defaultValue: "_i < 10" }], inputs: 1, outputs: 1 },
  { type: "for_each", label: "Для каждого", category: "loop", color: "#10b981", fields: [{ key: "arrayVar", label: "Массив", type: "text", defaultValue: "items" }, { key: "itemVar", label: "Элемент", type: "text", defaultValue: "item" }], inputs: 1, outputs: 1 },
  { type: "create_variable", label: "Создать переменную", category: "variable", color: "#ec4899", fields: [{ key: "name", label: "Имя", type: "text", defaultValue: "myVar" }, { key: "value", label: "Значение", type: "text", defaultValue: "0" }], inputs: 1, outputs: 1 },
  { type: "set_variable", label: "Изменить переменную", category: "variable", color: "#ec4899", fields: [{ key: "name", label: "Имя", type: "text" }, { key: "value", label: "Значение", type: "text" }], inputs: 1, outputs: 1 },
  { type: "math_op", label: "Математика", category: "variable", color: "#ec4899", fields: [{ key: "target", label: "Результат в", type: "text", defaultValue: "result" }, { key: "expression", label: "Выражение", type: "text", defaultValue: "count + 1" }], inputs: 1, outputs: 1 },
  { type: "set_timeout", label: "Таймер", category: "timer", color: "#06b6d4", fields: [{ key: "delay", label: "мс", type: "number", defaultValue: "1000" }], inputs: 1, outputs: 1 },
  { type: "set_interval", label: "Интервал", category: "timer", color: "#06b6d4", fields: [{ key: "interval", label: "мс", type: "number", defaultValue: "1000" }], inputs: 1, outputs: 1 },
  { type: "wait_ms", label: "Пауза (await)", category: "timer", color: "#06b6d4", fields: [{ key: "ms", label: "мс", type: "number", defaultValue: "500" }], inputs: 1, outputs: 1 },
  {
    type: "http_request",
    label: "HTTP (внешний)",
    category: "http",
    color: "#ef4444",
    fields: [
      { key: "method", label: "Метод", type: "select", defaultValue: "GET", options: [{ value: "GET", label: "GET" }, { value: "POST", label: "POST" }, { value: "PUT", label: "PUT" }, { value: "DELETE", label: "DELETE" }] },
      { key: "url", label: "URL", type: "text" },
      { key: "headers", label: "Заголовки JSON", type: "textarea", defaultValue: "{}" },
      { key: "body", label: "Тело JSON", type: "textarea", defaultValue: "{}" },
      { key: "responseVar", label: "Ответ в", type: "text", defaultValue: "response" },
    ],
    inputs: 1,
    outputs: 2,
  },
  {
    type: "site_api_request",
    label: "API сервера сайта",
    category: "server",
    color: "#7c3aed",
    fields: [
      { key: "path", label: "Путь", type: "text", defaultValue: "api/hello" },
      { key: "method", label: "Метод", type: "select", defaultValue: "GET", options: [{ value: "GET", label: "GET" }, { value: "POST", label: "POST" }] },
      { key: "body", label: "Тело JSON", type: "textarea", defaultValue: "{}" },
      { key: "responseVar", label: "Ответ в", type: "text", defaultValue: "apiData" },
    ],
    inputs: 1,
    outputs: 2,
  },
  { type: "parse_json", label: "Разобрать JSON", category: "http", color: "#ef4444", fields: [{ key: "sourceVar", label: "Из", type: "text" }, { key: "path", label: "Путь", type: "text" }, { key: "targetVar", label: "В", type: "text" }], inputs: 1, outputs: 1 },
  { type: "stop", label: "Стоп", category: "action", color: "#6b7280", inputs: 1 },
];

/** Блоки логики обработчика на сервере (без кода) */
export const SERVER_LOGIC_BLOCKS: BlockDefinition[] = [
  { type: "srv_entry", label: "Запрос пришёл", category: "trigger", color: "#a855f7", outputs: 1 },
  {
    type: "srv_return",
    label: "Ответить JSON",
    category: "action",
    color: "#22c55e",
    fields: [
      { key: "status", label: "HTTP код", type: "select", defaultValue: "200", options: [
        { value: "200", label: "200 OK" }, { value: "201", label: "201 Created" },
        { value: "400", label: "400 Bad Request" }, { value: "404", label: "404" },
        { value: "500", label: "500 Error" },
      ]},
      { key: "bodyJson", label: "JSON ответа", type: "textarea", defaultValue: '{"ok":true}' },
    ],
    inputs: 1,
  },
  { type: "srv_get_body", label: "Поле из тела", category: "variable", color: "#ec4899", fields: [{ key: "field", label: "Поле", type: "text", defaultValue: "email" }, { key: "varName", label: "В переменную", type: "text", defaultValue: "email" }], inputs: 1, outputs: 1 },
  { type: "srv_get_query", label: "Query-параметр", category: "variable", color: "#ec4899", fields: [{ key: "param", label: "Имя", type: "text", defaultValue: "id" }, { key: "varName", label: "В", type: "text", defaultValue: "id" }], inputs: 1, outputs: 1 },
  { type: "srv_set_var", label: "Переменная =", category: "variable", color: "#ec4899", fields: [{ key: "name", label: "Имя", type: "text" }, { key: "value", label: "Значение", type: "text" }], inputs: 1, outputs: 1 },
  {
    type: "srv_if",
    label: "Если",
    category: "condition",
    color: "#8b5cf6",
    fields: [
      { key: "left", label: "Левое", type: "text" },
      { key: "operator", label: "Оператор", type: "select", defaultValue: "==", options: [
        { value: "==", label: "==" }, { value: "!=", label: "!=" },
        { value: ">", label: ">" }, { value: "<", label: "<" }, { value: "includes", label: "содержит" },
      ]},
      { key: "right", label: "Правое", type: "text" },
    ],
    inputs: 1,
    outputs: 2,
  },
  { type: "srv_repeat", label: "Повторить", category: "loop", color: "#10b981", fields: [{ key: "count", label: "Раз", type: "number", defaultValue: "5" }], inputs: 1, outputs: 1 },
  { type: "srv_foreach", label: "Для каждого в", category: "loop", color: "#10b981", fields: [{ key: "arrayVar", label: "Массив", type: "text" }, { key: "itemVar", label: "Элемент", type: "text", defaultValue: "row" }], inputs: 1, outputs: 1 },
  { type: "srv_validate", label: "Проверка поля", category: "condition", color: "#8b5cf6", fields: [{ key: "field", label: "Поле тела", type: "text" }, { key: "required", label: "Обязательно", type: "select", defaultValue: "yes", options: [{ value: "yes", label: "Да" }, { value: "no", label: "Нет" }] }], inputs: 1, outputs: 2 },
  { type: "srv_merge", label: "Собрать JSON", category: "action", color: "#22c55e", fields: [{ key: "template", label: "Шаблон JSON", type: "textarea", defaultValue: '{"ok":true}' }], inputs: 1, outputs: 1 },
];

export const CATEGORY_LABELS: Record<string, string> = {
  trigger: "Триггеры",
  action: "Действия",
  condition: "Условия",
  loop: "Циклы",
  variable: "Переменные",
  timer: "Таймеры",
  http: "HTTP",
  server: "Сервер",
  logic: "Логика",
};

export function getBlockDefFrom(
  defs: BlockDefinition[],
  type: string
): BlockDefinition | undefined {
  return defs.find((b) => b.type === type);
}
