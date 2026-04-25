import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { processNextLevel } from './posts.ts';

test('processNextLevel returns 6 items for 2 folders each containing 3 markdown files', async () => {
	const root = await mkdtemp(join(tmpdir(), 'blog-test-'));
	try {
		for (const folder of ['folder1', 'folder2']) {
			const dir = join(root, folder);
			await mkdir(dir);
			for (let i = 1; i <= 3; i++) {
				await writeFile(join(dir, `post${i}.md`), `---\ntitle: Post ${i}\npublished: April 25, 2026\nsubtitle: Subtitle\n---\n\nContent`);
			}
		}

		const result = await processNextLevel(root);
		assert.equal(result.length, 6);
	} finally {
		await rm(root, { recursive: true });
	}
});
