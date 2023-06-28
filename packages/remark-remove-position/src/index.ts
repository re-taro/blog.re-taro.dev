import { removePosition } from "unist-util-remove-position";
import type { Root } from "mdast";
import type { Plugin } from "unified";

export const remarkRemovePosition: Plugin<Array<never>, Root> = () => {
  return (tree) => {
    removePosition(tree, true);
  };
};
