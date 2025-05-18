import { fromHtml } from 'hast-util-from-html';
import { select } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html';
import { css } from 'styled-system/css';
import { sanitize } from './sanitize';
import type { OEmbedRich } from 'oembed';
import type { FC } from 'react';

interface Props {
	node: OEmbedRich;
}

const transform = (html: string) => {
	const hast = fromHtml(html);
	const iframe = select('iframe', hast);
	if (iframe?.properties['style']?.toString().includes('aspect-ratio:')) {
		iframe.properties['width'] = '100%';
		iframe.properties['height'] = '100%';
	}

	return toHtml(hast);
};

export const Rich: FC<Props> = ({ node }) => {
	return (
		<div
			data-oembed
			className={css({ width: 'full' })}
			dangerouslySetInnerHTML={{ __html: transform(sanitize(node.html)) }}
		/>
	);
};
