import { css } from 'styled-system/css';
import { Temporal } from 'temporal-polyfill';
import type { FC } from 'react';

export const BlogList: FC = async () => {
	const { allBlogs } = await import('content-collections');

	return (
		<>
			{allBlogs
				.filter((blog) => import.meta.env.DEV || blog.published)
				.sort((a, b) =>
					Temporal.ZonedDateTime.compare(
						Temporal.ZonedDateTime.from(b.publishedAt),
						Temporal.ZonedDateTime.from(a.publishedAt),
					),
				)
				.map((blog) => (
					<section
						key={blog._meta.directory}
						className={css({
							borderBottom: '[1.2px solid {colors.border.main}]',
							marginTop: '6',
							paddingBottom: '2',
						})}>
						<h2
							className={css({
								color: 'text.main',
								fontSize: '2xl',
								fontWeight: 'bold',
								lineHeight: 'tight',
							})}>
							<a
								className={css({
									_focus: {
										color: 'accent.main',
									},
									_hover: {
										color: 'accent.main',
									},
								})}
								href={`/p/${blog._meta.directory}`}>
								{blog.title}
							</a>
						</h2>
						<time
							className={css({
								color: 'text.secondary',
								fontSize: 'm',
								lineHeight: 'normal',
								marginY: '2',
							})}
							dateTime={Temporal.ZonedDateTime.from(blog.publishedAt).toString()}>
							{Temporal.PlainDate.from(blog.publishedAt).toString()}
						</time>
						<p
							className={css({
								color: 'text.secondary',
								fontSize: 'm',
								lineHeight: 'normal',
								marginY: '4',
							})}>
							{`${blog.abstract.slice(0, 140)}...`}
						</p>
					</section>
				))}
		</>
	);
};
