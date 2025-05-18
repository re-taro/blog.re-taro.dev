import { css } from 'styled-system/css';
import { LinkCard } from './LinkCard';
import { Permalink } from './Permalink';
import { Photo } from './Photo';
import { Rich } from './Rich';
import { Video } from './Video';
import type * as A from 'ast';
import type { OEmbed as OEmbedT } from 'oembed';
import type { FC } from 'react';

interface OEmbedProps {
	oembed: OEmbedT;
}

interface EmbedProps {
	node: A.Embed;
}

const OEmbed: FC<OEmbedProps> = ({ oembed }) => {
	if (oembed.type === 'photo' && oembed.url) {
		return <Photo node={oembed} />;
	} else if (oembed.type === 'video' && oembed.html) {
		return <Video node={oembed} />;
	} else if (oembed.type === 'rich' && oembed.html) {
		return <Rich node={oembed} />;
	}
	return null;
};

export const Embed: FC<EmbedProps> = ({ node }) => {
	const url = new URL(node.src);

	if (node.oembed != null) {
		return <OEmbed oembed={node.oembed} />;
	} else if (node.meta != null) {
		return <LinkCard meta={node.meta} node={node} />;
	} else if (url.hostname === 'www.youtube.com') {
		<div
			className={css({
				paddingBottom: '[56.25%]',
				position: 'relative',
				width: 'full',
			})}>
			<iframe
				className={css({
					height: 'full',
					left: '0',
					position: 'absolute',
					top: '0',
					width: 'full',
				})}
				height={node.height}
				src={node.src}
				title="Youtube Embed"
				width={node.width}
			/>
		</div>;
	} else if (url.hostname === 'docs.google.com' && url.pathname.startsWith('/presentation/d/')) {
		return (
			<div
				className={css({
					paddingBottom: '[59.27%]',
					position: 'relative',
					width: 'full',
				})}>
				<iframe
					className={css({
						height: 'full',
						left: '0',
						position: 'absolute',
						top: '0',
						width: 'full',
					})}
					allowFullScreen={node.allowFullScreen}
					src={node.src}
					title="Google Slides Embed"
					width={node.width}
				/>
			</div>
		);
	} else if (node.codeLines != null) {
		return <Permalink node={node} />;
	}

	return null;
};
