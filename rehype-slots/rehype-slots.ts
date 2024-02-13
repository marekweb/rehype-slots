import type { Plugin } from "unified";
import hastUtilSlots from "../hast-util-slots/hast-util-slots.js";
import type { HastUtilReplaceSlotsOptions } from "../hast-util-slots/hast-util-slots.js";
import { Root } from "hast";

export type RehypeSlotsOptions = HastUtilReplaceSlotsOptions;

const rehypeSlots: Plugin<[RehypeSlotsOptions], Root, Root> =
  function rehypeSlots(options: RehypeSlotsOptions) {
    return function (tree) {
      return hastUtilSlots(tree, options);
    };
  };

export default rehypeSlots;
