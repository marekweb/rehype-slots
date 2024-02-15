import { Root, ElementContent, Element, Parent } from "hast";
import { visit, SKIP } from "unist-util-visit";
import type { VisitorResult } from "unist-util-visit";
import { isElement } from "hast-util-is-element";
import wrapNodeArray from "./wrap-node-array.js";

type FallbackBehavior = "unwrap" | "remove" | "keep";

export type SlotReplaceValue =
  | string
  | ElementContent
  | Root
  | ElementContent[];

export type SlotReplacer = (
  name: string,
  slot: Element,
) => SlotReplaceValue | undefined;

export interface HastUtilReplaceSlotsOptions {
  /**
   * The tag name to use for the slot element if you want to use a different
   * element than "slot".
   * @default "slot"
   */
  slotTagName?: string;

  /**
   * Attribute name on the slot element that contains the slot name.
   * @default "name"
   */
  slotNameAttribute?: string;

  /**
   * The values to replace the slots with. Each slot's "name" attribute will be
   * used to look up the value by key in the values object.
   */
  values?: Record<string, SlotReplaceValue | SlotReplacer>;

  /**
   * Dynamic replacer function that will be called for each slot whose name was not found
   * in the values object. It will be called with (slotName, slotElement) and can return
   * a value to replace the slot with, or return undefined to use the fallback behavior.
   */
  replacer?: SlotReplacer;

  /**
   * Fallback behavior when a slot is not found in the values object, and, if
   * using a replacer function, when the replacer function returns undefined.
   * *
   * - "unwrap": Replace the slot with its own children, i.e. unwrap it. This is
   *   the default.
   * - "remove": Remove the slot element entirely.
   * - "keep": Do nothing, keep the slot element as it is.
   *
   * @default "unwrap"
   */
  fallbackBehavior?: FallbackBehavior;
}

export default function hastUtilReplaceSlots(
  tree: Root,
  options: HastUtilReplaceSlotsOptions = {},
) {
  const {
    slotTagName = "slot",
    slotNameAttribute = "name",
    values = {},
    replacer,
    fallbackBehavior = "unwrap",
  } = options ?? {};

  visit(tree, (node, index, parent) => {
    if (isElement(node, slotTagName) && parent && index !== undefined) {
      // Get the slot name from the element's attribute
      const name = node.properties[slotNameAttribute] as string | undefined;
      if (!name) {
        return executeFallback(fallbackBehavior, parent, index, node);
      }

      let foundValueForSlot = values[name];

      // Allow foundValueForSlot to be dynamically generated if it's a function
      if (typeof foundValueForSlot === "function") {
        foundValueForSlot = foundValueForSlot(name, node);
      }

      if (!foundValueForSlot && replacer) {
        foundValueForSlot = replacer(name, node);
      }

      if (foundValueForSlot) {
        const replacementNodes = wrapNodeArray(foundValueForSlot);

        // Replace the slot with the replacement nodes
        parent.children.splice(
          index,
          1,
          ...(replacementNodes as ElementContent[]),
        );
        return [SKIP, index];
      } else {
        return executeFallback(fallbackBehavior, parent, index, node);
      }
    }
  });
}

function executeFallback(
  fallbackBehavior: FallbackBehavior,
  parent: Parent,
  index: number,
  node: Element,
): VisitorResult {
  switch (fallbackBehavior) {
    case "keep":
      return [SKIP, index + 1];
    case "remove":
      // Remove the slot element entirely
      parent.children.splice(index, 1);
      return [SKIP, index];
    case "unwrap":
    default:
      // Replace the slot with its own children
      parent.children.splice(index, 1, ...node.children);
      return [SKIP, index];
  }
}
