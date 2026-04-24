import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import { join } from 'path';

import MyApp from "../src/MyApp";
import nameData from "../data/name.json";
import siteConfig from "../siteconfig.json"
import { latestFirst, validateDate } from "../utils/publishDate";

import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Dirent } from "fs";

const app = new Hono({ strict: false });

if (!process.env.NETLIFY) {
	app.use('/*', serveStatic({ root: './public' }));
}


app.get("/", async (context) => {

	const { docTitle, description } = siteConfig;

	
	
	interface FrontMatter {
		title: string;
		published: string;
		subtitle: string;
	}
	
	interface ProcessedFile  {
		frontmatter: FrontMatter,
		markdownBody: string,
		slug: string,
		tags: Array<string>
	}
	
	let posts : Array<ProcessedFile> = []
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
			frontmatter: document.data as Front,
			markdownBody: document.content,
			slug: postEntry.name.slice(0,-3),
			tags
      }
	
	}
	const postsDir = join(process.cwd(), 'posts');

	async function processNextLevel(folder: string){
		const postsEntries = await readdir(folder, {
			withFileTypes: true
		})
		for (let postEntry of postsEntries) {
			if (postEntry.isFile()) {
				const fullPath = join(folder, postEntry.name)
				posts.push(await processFile(postEntry, fullPath))
			} else {
				await processNextLevel(join(folder, postEntry.name))
			}
		}

	}

	await processNextLevel(postsDir)
	posts = posts.sort(function (post1, post2) {
        return latestFirst(
          validateDate(post1.frontmatter.published),
          validateDate(post2.frontmatter.published)
        );
      });

	console.log({posts})


/* 	let posts = {};
	// for each of the folders, read all of the files one layer down in them
	for (let folder of postFolders) {
	   const postNames = await readdir(join(process.cwd(), `posts/${folder}`))

	   posts[folder] = postNames
	}
	console.log(posts) */

	//console.log(await readdir(join(process.cwd(), 'posts'))
	// map slugs to data
	// single array of objects , where the object has a slug, folderName, or folderNames, and markdown content

	


	const appHTML = renderToString(createElement(MyApp, nameData));
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

		<title>Ryans Blog</title>
	</head>
	<body>
		<div id="root">${appHTML}</div>
	</body>
	<script type="module" src="/hydrater.js"></script>
	<script type="application/json" id="STARTER_DATA">${JSON.stringify(nameData)}</script>
	</html>`);
});

export default app;
