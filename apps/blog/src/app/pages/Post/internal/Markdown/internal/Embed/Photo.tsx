import { css } from 'styled-system/css';
import type { OEmbedPhoto } from 'oembed';
import type { FC } from 'react';

interface Props {
	node: OEmbedPhoto;
}

export const Photo: FC<Props> = ({ node }) => {
	return (
		<img
			className={css({
				marginX: 'auto',
				maxHeight: 'full',
				maxWidth: 'full',
			})}
			data-oembed
			alt={node.title}
			decoding="async"
			height={node.height}
			loading="lazy"
			src={node.url}
			width={node.width}
		/>
	);
};
