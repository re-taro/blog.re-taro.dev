import { component$ } from "@builder.io/qwik";
import type * as A from "~/libs/plugins/ast/ast";

interface Props {
	node: A.Html;
}

export default component$<Props>(({ node }) => {
	return <span dangerouslySetInnerHTML={node.value} />;
});
