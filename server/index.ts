import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import app from "./app";

app.use("/*", serveStatic({ root: "./public" }));

serve({ fetch: app.fetch, port: 3000 }, () => {
	console.log("spun up server");
});
