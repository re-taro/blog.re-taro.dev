import { css } from 'styled-system/css';
import { sanitize } from './sanitize';
import type { OEmbedVideo } from 'oembed';
import type { FC } from 'react';

interface Props {
	node: OEmbedVideo;
}

export const Video: FC<Props> = ({ node }) => {
	return (
		<div data-oembed className={css({ width: 'full' })} dangerouslySetInnerHTML={{ __html: sanitize(node.html) }} />
	);
};
