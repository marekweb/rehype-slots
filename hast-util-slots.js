const unistUtilFlatMap = require("unist-util-flatmap");

/**
 * Wrap into a node list.
 *
 * Allowed values:
 * - string: wrap it in a text node
 * - node: wrap it in an array as [node]
 * - root: extract the children
 * - array: keep it as-is (assuming it's an array of nodes)
 */
function wrapNodeArray(input) {
  if (typeof input === "string") {
    return [{ type: "text", value: input }];
  } else if (Array.isArray(input)) {
    return input;
  } else if (input.type === "root") {
    return input.children;
  }
  return [input];
}

function hastUtilSlots(tree, values = {}, unwrap = true) {
  return unistUtilFlatMap(tree, node => {
    if (node.type === "element" && node.tagName === "slot") {
      const name = node.properties.name;
      const replacementNodes = values[name];
      if (replacementNodes) {
        return wrapNodeArray(replacementNodes);
      } else if (unwrap) {
        // Unwrapping removes the slot element and keeps its contents
        return node.children;
      }
    }

    // Unchanged
    return [node];
  });
}

module.exports = hastUtilSlots;
