import { Suspense } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Post as Component } from './internal/Post';
import type { RequestInfo } from '@redwoodjs/sdk/worker';
import type { JSX } from 'react';

export const Post = ({ request }: RequestInfo): JSX.Element => {
	return (
		<Layout>
			<Suspense fallback={null}>
				<Component request={request} />
			</Suspense>
		</Layout>
	);
};
