import { css } from 'styled-system/css';
import { Temporal } from 'temporal-polyfill';
import { Heading } from '../Markdown/internal/Heading';
import { Tags } from '../Tags';
import type * as A from 'ast';
import type { FC } from 'react';
import type { SystemStyleObject } from 'styled-system/types';

interface Props {
	publishedAt: string;
	tags: string[];
	title: A.Heading;
	css?: SystemStyleObject | undefined;
	updatedAt?: string | undefined;
}

export const Header: FC<Props> = ({ publishedAt, tags, title, css: cssStyle, updatedAt }) => {
	return (
		<header
			className={css(
				{
					'& > .markdown_heading': {
						gridArea: 'title',
					},
					'display': 'grid',
					'gap': '3',
					'gridTemplateAreas': `"meta" "title"`,
					'gridTemplateRows': '[repeat(2, auto)]',
					'paddingBottom': '8',
				},
				cssStyle,
			)}>
			<dl
				className={css({
					alignItems: 'center',
					columnGap: '4',
					display: 'flex',
					flexWrap: 'wrap',
					gridArea: 'meta',
				})}>
				<div
					className={css({
						'& > dd': {
							display: 'inline',
						},
						'& > dt': {
							_after: {
								content: "':'",
							},
							_supportsAlternativeTextAfter: {
								_after: {
									content: "':' / ''",
								},
							},
							display: 'inline',
							marginRight: '1',
						},
						'color': 'text.main',
						'display': 'inline',
					})}>
					<dt>投稿日</dt>
					<dd>
						<time dateTime={Temporal.ZonedDateTime.from(publishedAt).toString({ timeZoneName: 'never' })}>
							{Temporal.ZonedDateTime.from(publishedAt).toPlainDate().toLocaleString('ja-JP')}
						</time>
					</dd>
				</div>
				{updatedAt != null && (
					<div
						className={css({
							'& > dd': {
								display: 'inline',
							},
							'& > dt': {
								_after: {
									content: "':'",
								},
								_supportsAlternativeTextAfter: {
									_after: {
										content: "':' / ''",
									},
								},
								display: 'inline',
								marginRight: '1',
							},
							'color': 'text.main',
							'display': 'inline',
						})}>
						<dt>更新日</dt>
						<dd>
							<time dateTime={Temporal.ZonedDateTime.from(updatedAt).toString({ timeZoneName: 'never' })}>
								{Temporal.ZonedDateTime.from(updatedAt).toPlainDate().toLocaleString('ja-JP')}
							</time>
						</dd>
					</div>
				)}
				<div
					className={css({
						'& > dd': {
							display: 'inline',
						},
						'& > dt': {
							_after: {
								content: "':'",
							},
							_supportsAlternativeTextAfter: {
								_after: {
									content: "':' / ''",
								},
							},
							display: 'inline',
							marginRight: '1',
						},
						'color': 'text.main',
						'display': 'inline',
					})}>
					<dt>タグ</dt>
					<dd>
						<Tags tags={tags} />
					</dd>
				</div>
			</dl>
			<Heading footnoteDefs={[]} node={title} />
		</header>
	);
};
