import type { Node } from "hast";

export default function isNode(node: unknown): node is Node {
  if (typeof node !== "object" || node === null) {
    return false;
  }

  const typedNode = node as Node;

  // The only requirement for a node is that it has a `type` property which is a string.
  return "type" in typedNode && typeof typedNode.type === "string";
}
