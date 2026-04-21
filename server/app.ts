import { createElement } from "react";
import { renderToString } from "react-dom/server";

import MyApp from "../src/MyApp";
import nameData from "../data/name.json";

import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono({ strict: false });

if (!process.env.NETLIFY) {
	app.use('/*', serveStatic({ root: './public' }));
}

app.get('/data', (c) => {
	return c.json(nameData)
})

app.get("/", async (context) => {
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
	</html>`);
});

export default app;
