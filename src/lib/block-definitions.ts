import type { BlockDefinition } from "@/types/editor";
import {
  CLIENT_BLOCK_DEFINITIONS,
  SERVER_LOGIC_BLOCKS,
  getBlockDefFrom,
} from "./block-catalog";

export const BLOCK_DEFINITIONS: BlockDefinition[] = CLIENT_BLOCK_DEFINITIONS;

export function getBlockDef(type: string): BlockDefinition | undefined {
  return getBlockDefFrom(CLIENT_BLOCK_DEFINITIONS, type) ||
    getBlockDefFrom(SERVER_LOGIC_BLOCKS, type);
}

export { CLIENT_BLOCK_DEFINITIONS, SERVER_LOGIC_BLOCKS } from "./block-catalog";
