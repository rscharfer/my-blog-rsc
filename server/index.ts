import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { createElement } from "react";
import { renderToString } from "react-dom/server";

import MyApp from "../src/MyApp";

import { Hono } from "hono";

const app = new Hono({ strict: false }) // strict: false means route '/hello' will be treated the same as route '/hello/'"

// when the browser's url points to localhost:3000, we are returning
// an entire document with the component converted to a HTML 
// interpolated into the string that is returned
app.get('/', (context) => {
	const appHTML = renderToString(createElement(MyApp))
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
	</html>`)
})

app.use('/*', serveStatic({ root: './public' }))



serve({ fetch: app.fetch, port: 3000 }, (info) => {
	console.log('spun up server')
})