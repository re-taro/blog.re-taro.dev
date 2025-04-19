import { env } from 'cloudflare:workers';
import { css } from 'styled-system/css';
import { Temporal } from 'temporal-polyfill';
import type { Blog } from 'contents';
import type { FC } from 'react';

interface Props {
	request: Request;
}

export const BlogList: FC<Props> = async ({ request }) => {
	const { blogs } = await env.CONTENTS.fetch(request).then(async (res) => await res.json<{ blogs: Blog[] }>());

	return (
		<>
			{blogs.map((blog) => (
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
