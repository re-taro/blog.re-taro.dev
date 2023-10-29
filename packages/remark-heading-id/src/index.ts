import GitHubSlugger from "github-slugger";
import type { Heading, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { isHeading } from "mdast-utils";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const visitorBuilder = (slugger: GitHubSlugger) => (node: Heading) => {
  const plainText = toString(node);
  node.identifier = slugger.slug(plainText);
};

export const remarkHeadingId: Plugin<never[], Root> = () => (tree) => {
  const slugger = new GitHubSlugger();
  const visitor = visitorBuilder(slugger);
  visit(tree, isHeading, visitor);
};

declare module "mdast" {
  interface Heading {
    identifier?: string;
  }
}
