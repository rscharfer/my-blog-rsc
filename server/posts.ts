import { readdir, readFile } from "fs/promises";
import { Dirent } from "fs";
import { join } from 'path';
import matter from "gray-matter";
import type { ProcessedFile, ProcessedFiles } from "../src/Index";

interface FrontMatter {
	title: string;
	published: string;
	subtitle: string;
}

export async function processFile(postEntry: Dirent, pathToPostEntry: string): Promise<ProcessedFile> {
	let hasSeenPosts = false;
	const tags = pathToPostEntry.split('/').reduce<Array<string>>((acc, next) => {
		if (next === 'posts') {
			hasSeenPosts = true;
			return acc;
		} else if (!hasSeenPosts || pathToPostEntry.endsWith(next)) {
			return acc;
		} else {
			acc.push(next);
			return acc;
		}
	}, []);

	const document = matter(await readFile(pathToPostEntry, 'utf8'));

	return {
		frontmatter: document.data as FrontMatter,
		markdownBody: document.content,
		slug: postEntry.name.slice(0, -3),
		tags,
	};
}

export async function processNextLevel(folder: string): Promise<ProcessedFiles> {
	let posts: Array<ProcessedFile> = [];

	const postsEntries = await readdir(folder, { withFileTypes: true });

	for (const postEntry of postsEntries) {
		if (postEntry.isFile()) {
			posts.push(await processFile(postEntry, join(folder, postEntry.name)));
		} else {
			posts = posts.concat(...await processNextLevel(join(folder, postEntry.name)));
		}
	}

	return posts;
}
