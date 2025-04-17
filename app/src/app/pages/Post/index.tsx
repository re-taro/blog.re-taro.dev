import { Suspense } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Post as Component } from './internal/Post';
import type { RequestInfo } from '@redwoodjs/sdk/worker';
import type { JSX } from 'react';

export const Post = ({ params }: RequestInfo<{ slug: string }>): JSX.Element => {
	return (
		<Layout>
			<Suspense fallback={null}>
				<Component slug={params.slug} />
			</Suspense>
		</Layout>
	);
};
