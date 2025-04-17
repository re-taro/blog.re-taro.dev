import { css } from 'styled-system/css';
import type { WithTransformedImage } from '../../../../../../../content-collections';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	node: A.Image;
}

export const Image: FC<Props> = ({ node }) => {
	if ((node as A.Image & (WithTransformedImage | undefined)).transformed != null) {
		// eslint-disable-next-line ts/no-non-null-assertion
		const srcs = (node as A.Image & (WithTransformedImage | undefined)).transformed!.sort((a, b) => b.dim.w - a.dim.w);
		// eslint-disable-next-line ts/restrict-template-expressions
		const srcset = srcs.map((src) => `${src.path} ${src.dim.w}w`).join(' ');

		return (
			<img
				alt={node.alt}
				decoding="async"
				height={srcs[0]?.dim.h}
				loading="lazy"
				src={srcs[0]?.path}
				srcSet={srcset}
				width={srcs[0]?.dim.w}
			/>
		);
	}
	return (
		<img
			className={css({
				height: 'auto',
				width: 'full',
			})}
			alt={node.alt}
			loading="lazy"
			src={node.url}
		/>
	);
};
