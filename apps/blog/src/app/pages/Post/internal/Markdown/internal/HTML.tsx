import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	node: A.Html;
}

export const HTML: FC<Props> = ({ node }) => {
	return <span dangerouslySetInnerHTML={{ __html: node.value }} />;
};
