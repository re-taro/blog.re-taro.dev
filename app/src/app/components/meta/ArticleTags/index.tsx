import type { FC } from 'react';

export const ArticleTags: FC<{ tags: string[] }> = ({ tags }) => {
	return (
		<>
			{tags.map((tag) => (
				<meta content={tag} property="article:tag" key={tag} />
			))}
		</>
	);
};
