import GitHubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { isHeading } from "mdast-utils";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Heading, Root } from "mdast";

export const remarkHeadingId: Plugin<Array<never>, Root> = () => {
  return (tree) => {
    const slugger = new GitHubSlugger();
    const visitor = visitorBuilder(slugger);
    visit(tree, isHeading, visitor);
  };
};

function visitorBuilder(slugger: GitHubSlugger) {
  return (node: Heading) => {
    const plainText = toString(node);
    node.identifier = slugger.slug(plainText);
  };
}

declare module "mdast" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Heading {
    identifier?: string;
  }
}
