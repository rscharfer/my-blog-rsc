import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { readFile } from 'fs/promises';

import MyApp from "../src/MyApp";

import { Hono } from "hono";

const app = new Hono({ strict: false });

async function getData(){
	const url = new URL('../data/name.json', import.meta.url)
	const data = await readFile(url, { encoding: 'utf8' });
	return JSON.parse(data)
}

app.get('/data', async (c) => {
	const data = await getData()

	return c.json(data)
})

app.get("/", async (context) => {
	const data = await getData()
	const appHTML = renderToString(createElement(MyApp, data));
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
	</html>`);
});

export default app;
