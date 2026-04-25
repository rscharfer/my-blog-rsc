import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { readdir, readFile } from "fs/promises";
import { Dirent } from "fs";
import { join } from 'path';

import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

import type { ProcessedFile, ProcessedFiles } from "../src/Index";
import Index from "../src/Index";
import siteConfig from "../siteconfig.json"
import { latestFirst, validateDate } from "../utils/publishDate";


import matter from "gray-matter";

const app = new Hono({ strict: false });

if (!process.env.NETLIFY) {
	app.use('/*', serveStatic({ root: './public' }));
}


app.get("/", async (context) => {

	const { docTitle } = siteConfig;

	interface FrontMatter {
		title: string;
		published: string;
		subtitle: string;
	}

		async function processFile(postEntry: Dirent, pathToPostEntry: string): Promise<ProcessedFile> {
		let hasSeenPosts = false;
		// split the path into pieces using "/" as separator
		// iterate through the pieces, ignoring them until you see the 'posts' piece
		// after that add each peace to the accumulation, but not the very last piece
		const tags = pathToPostEntry.split('/').reduce<Array<string>>((acc, next) => {
			if (next === 'posts') {
				hasSeenPosts = true;
				return acc;
			}
			else if (!hasSeenPosts || pathToPostEntry.endsWith(next)) {
				return acc;
			} else {
				acc.push(next)
				return acc;
			} 
		}, [])
        // remove the front matter (i.e. everything above the top "---" and bottom "---") and return front matter
		// and the rest of the content
		const document = matter(await readFile(pathToPostEntry, 'utf8'))

		return {
			frontmatter: document.data as FrontMatter,
			markdownBody: document.content,
			slug: postEntry.name.slice(0,-3),
			tags
      }
	
	}
	const postsDir = join(process.cwd(), 'posts');

	async function processNextLevel(folder: string) : Promise<ProcessedFiles>{
		let posts : Array<ProcessedFile> = []

		const postsEntries = await readdir(folder, {
			withFileTypes: true
		})

		for (let postEntry of postsEntries) {
			if (postEntry.isFile()) {
				const fullPath = join(folder, postEntry.name)
				posts.push(await processFile(postEntry, fullPath))
			} else {
				return [...posts, ...await processNextLevel(join(folder, postEntry.name))]
			}
		}

		return posts;

	}

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
	
	// Escape JSON for safe injection into script tag (Next.js approach)
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
