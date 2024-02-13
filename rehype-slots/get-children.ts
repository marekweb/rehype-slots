import { Parent } from "unist";
import { Node } from "hast";

export function getChildren(node: Node) {
  return (node as unknown as Parent).children ?? [];
}
