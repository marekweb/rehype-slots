import { Root } from "hast";

export default function isRoot(node: unknown): node is Root {
  if (typeof node !== "object" || node === null) {
    return false;
  }

  const rootNode = node as Root;

  return (
    "type" in rootNode &&
    rootNode.type === "root" &&
    "children" in rootNode &&
    Array.isArray(rootNode.children)
  );
}
