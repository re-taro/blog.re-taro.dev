import { css } from 'styled-system/css';
import { Temporal } from 'temporal-polyfill';
import type { Blog } from 'content-collections';
import type { FC } from 'react';

export const TagList: FC = async () => {
	const { allBlogs } = await import('content-collections');

	return (
		<>
			{[
				...allBlogs
					.filter((blog) => import.meta.env.DEV || blog.published)
					.reduce((acc, blog) => {
						for (const tag of blog.tags) {
							if (acc.has(tag))
								acc.get(tag)?.push(blog); // MEMO: This is an safe operation because the tag is already in the map.
							else acc.set(tag, [blog]);
						}

						return acc;
					}, new Map<string, Blog[]>())
					.entries(),
			]
				.sort((a, b) => (a[0] > b[0] ? 1 : -1))
				.map(([tag, blogs]) => (
					<section
						key={tag}
						className={css({
							marginTop: '6',
							paddingBottom: '2',
						})}>
						<h2
							className={css({
								_before: {
									_supportsAlternativeTextAfter: {
										content: "'##' / ''",
									},
									content: "'##'",
									marginLeft: '[-1.8em]',
									position: 'absolute',
								},
								color: 'text.main',
								fontSize: '2xl',
								fontWeight: 'bold',
								lineHeight: 'tight',
								marginLeft: '[1.8em]',
								position: 'relative',
							})}
							// eslint-disable-next-line ts/restrict-template-expressions
							id={`#${tag[0]}`}>
							{tag}
						</h2>
						{blogs
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
									<h3
										className={css({
											color: 'text.main',
											fontSize: 'xl',
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
									</h3>
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
					</section>
				))}
		</>
	);
};
