import { css } from 'styled-system/css';
import { Tag } from './internal/Tag';
import type { FC } from 'react';

interface Props {
	tags: string[];
}

export const Tags: FC<Props> = ({ tags }) => {
	return (
		<ul
			className={css({
				display: 'inline-flex',
			})}>
			{tags.map((tag) => (
				<Tag key={tag} tag={tag} />
			))}
		</ul>
	);
};
