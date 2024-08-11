import type { Component } from "solid-js";
import type * as A from "~/libs/plugins/ast/ast";

interface Props {
	node: A.Html;
}

const HTML: Component<Props> = (props) => {
	// eslint-disable-next-line solid/no-innerhtml
	return <span innerHTML={props.node.value} />;
};

export default HTML;
