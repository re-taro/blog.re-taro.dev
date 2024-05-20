import type { PartytownConfig } from "@builder.io/partytown/integration";
import { partytownSnippet } from "@builder.io/partytown/integration";

export interface PartytownProps extends PartytownConfig {}

export function QwikPartytown(props: PartytownProps) {
	return <script dangerouslySetInnerHTML={partytownSnippet(props)} />;
}
