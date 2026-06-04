export type PositionMode = "relative" | "absolute" | "fixed" | "flex" | "grid";

export type ElementType =
  | "text"
  | "heading"
  | "button"
  | "image"
  | "container"
  | "section"
  | "form"
  | "input"
  | "textarea"
  | "video"
  | "map"
  | "slider"
  | "divider"
  | "link"
  | "navbar"
  | "footer"
  | "icon"
  | "embed"
  | "spacer"
  | "list"
  | "table"
  | "card"
  | "accordion"
  | "tabs";

export interface ElementStyles {
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  background?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textShadow?: string;
  border?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  boxShadow?: string;
  opacity?: string;
  filter?: string;
  backdropFilter?: string;
  transform?: string;
  transition?: string;
  animation?: string;
  animationDuration?: string;
  animationDelay?: string;
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: string;
  overflow?: string;
  cursor?: string;
  objectFit?: string;
  position?: string;
  [key: string]: string | undefined;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  content?: string;
  href?: string;
  src?: string;
  alt?: string;
  placeholder?: string;
  children: string[];
  parentId: string | null;
  positionMode: PositionMode;
  styles: ElementStyles;
  className?: string;
  attributes?: Record<string, string>;
  locked?: boolean;
  hidden?: boolean;
  navigateTo?: string;
  navigateType?: "url" | "page";
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  elements: Record<string, CanvasElement>;
  rootIds: string[];
  scripts: PageScript[];
  globalScripts: PageScript[];
}

export type BlockCategory =
  | "trigger"
  | "action"
  | "condition"
  | "loop"
  | "variable"
  | "timer"
  | "http"
  | "server"
  | "logic";

export interface SiteServerEndpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description?: string;
  /** JSON-ответ, если логика блоков пуста */
  responseJson: string;
  /** Визуальная логика обработчика (блоки) */
  logic?: PageScript;
  useBlockLogic?: boolean;
}

export interface BlockField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "element" | "color" | "textarea";
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

export interface BlockDefinition {
  type: string;
  label: string;
  category: BlockCategory;
  color: string;
  fields?: BlockField[];
  inputs?: number;
  outputs?: number;
}

export interface BlockNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, string>;
}

export interface BlockEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface PageScript {
  elementId: string;
  nodes: BlockNode[];
  edges: BlockEdge[];
}

export interface ProjectData {
  version: number;
  elements: Record<string, CanvasElement>;
  rootIds: string[];
  scripts: PageScript[];
  globalScripts: PageScript[];
  pages: Page[];
  currentPageId: string;
  meta: {
    title: string;
    description: string;
    favicon?: string;
    lang: string;
  };
  settings: {
    canvasWidth: number;
    gridSize: number;
    snapToGrid: boolean;
  };
  server?: {
    enabled: boolean;
    endpoints: SiteServerEndpoint[];
  };
}

const HOME_ROOT: CanvasElement = {
  id: "root",
  type: "section",
  name: "Страница",
  children: [],
  parentId: null,
  positionMode: "relative",
  styles: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#ffffff",
    position: "relative",
  },
};

export const HOME_PAGE_ID = "page_home";

export const DEFAULT_PROJECT_DATA: ProjectData = {
  version: 1,
  pages: [
    {
      id: HOME_PAGE_ID,
      name: "Главная",
      slug: "home",
      elements: { root: { ...HOME_ROOT } },
      rootIds: ["root"],
      scripts: [],
      globalScripts: [],
    },
  ],
  currentPageId: HOME_PAGE_ID,
  elements: { root: { ...HOME_ROOT } },
  rootIds: ["root"],
  scripts: [],
  globalScripts: [],
  meta: { title: "Мой сайт", description: "", lang: "ru" },
  settings: { canvasWidth: 1200, gridSize: 8, snapToGrid: true },
  server: { enabled: false, endpoints: [] },
};

export type ViewportMode = "desktop" | "tablet" | "mobile";
