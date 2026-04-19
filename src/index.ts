import { serve } from "@hono/node-server";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

import MyApp from "./MyApp.js";

import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/myapp", () => {

  return new Response(renderToString(createElement(MyApp)), {
    headers: {
      "Content-Type": "text/html",
    },
  });
});

app.get("/hotdamn", (c) => {
  // just for testing
  return c.text("hot damn!");
});

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
