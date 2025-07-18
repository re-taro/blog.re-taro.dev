import type { AxeResults } from 'axe-core';

export const violationFingerprints = (accessibilityScanResults: AxeResults): string => {
	const violationFingerprints = accessibilityScanResults.violations.map((violation) => ({
		rule: violation.id,
		// These are CSS selectors which uniquely identify each element with
		// a violation of the rule in question.
		targets: violation.nodes.map((node) => node.target),
	}));

	return JSON.stringify(violationFingerprints, null, 2);
};
