import { Suspense } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Post as Component } from './internal/Post';
import type { JSX } from 'react';
import type { RequestInfo } from 'rwsdk/worker';

export const Post = ({ request }: RequestInfo): JSX.Element => {
	return (
		<Layout>
			<Suspense fallback={null}>
				<Component request={request} />
			</Suspense>
		</Layout>
	);
};
