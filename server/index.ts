import { serve } from "@hono/node-server";

import app from "./app";

serve({ fetch: app.fetch, port: 3000 }, () => {
	console.log("spun up server");
});
