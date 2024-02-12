import { Node, Text } from "hast";
import isRoot from "./is-root.js";
import isNode from "./is-node.js";

/**
 * Wrap into a node list.
 *
 * Allowed values:
 * - string: wrap it in a text node
 * - node: wrap it in an array as [node]
 * - root: extract the children
 * - array: keep it as-is (assuming it's an array of nodes)
 */
function wrapNodeArray(input: unknown): Node[] {
  if (typeof input === "string") {
    return [{ type: "text", value: input } as Text];
  } else if (Array.isArray(input) && input.every(isNode)) {
    return input;
  } else if (isRoot(input)) {
    return input.children;
  } else if (isNode(input)) {
    return [input];
  }

  throw new Error(
    "Expected a string, node, root, or array of nodes. Found " +
      JSON.stringify(input),
  );
}

export default wrapNodeArray;
