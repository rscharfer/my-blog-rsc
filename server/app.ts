import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { join } from 'path';

import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

import Index from "../src/Index";
import { processNextLevel } from "./posts";
import siteConfig from "../siteconfig.json"
import { latestFirst, validateDate } from "../utils/publishDate";

const app = new Hono({ strict: false });

if (!process.env.NETLIFY) {
	app.use('/*', serveStatic({ root: './public' }));
}

app.get("/", async (context) => {
	const { docTitle } = siteConfig;
	const postsDir = join(process.cwd(), 'posts');

	const posts = (await processNextLevel(postsDir)).sort(function (post1, post2) {
		return latestFirst(
			validateDate(post1.frontmatter.published),
			validateDate(post2.frontmatter.published)
		);
	});

	const props = {
		posts,
		docTitle
	}

	const appHTML = renderToString(createElement(Index, props));

	const jsonString = JSON.stringify(props)
		.replace(/</g, '\\u003c')
		.replace(/-->/g, '--\\>');

	return context.html(`<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script type="importmap">
			{
				"imports": {
				"react": "https://esm.sh/react@19.2.0?dev",
				"react-dom/client": "https://esm.sh/react-dom@19.2.0/client?dev"
				}
			}
		</script>
		<link rel='stylesheet' href='./globalStyles.css'>
		<title>${docTitle}</title>
	</head>
	<body>
		<div id="root">${appHTML}</div>
		<script id="STARTER_DATA" type="application/json">${jsonString}</script>
	</body>
	<script type="module" src="/hydrater.js"></script></html>`);
});

export default app;
