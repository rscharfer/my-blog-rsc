import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { serve } from "@hono/node-server";
// import { createElement } from 'react';
import { renderToString } from "react-dom/server";
import MyApp from "./MyApp.jsx";
// import the thing from react that
// allows me to run my application on Node.js
// its a lot faster than Express, that's why you use it instead of Express
import { Hono } from "hono";
const app = new Hono();
app.get("/", (c) => {
    return c.text("Hello Hono!");
});
app.get("/myapp", () => {
    return new Response(renderToString(_jsx(MyApp, {})), {
        status: 200,
        statusText: "woo hoo",
        headers: {
            "Content-Type": "text/html",
        },
    });
});
app.get("/hotdamn", (c) => {
    return c.text("hot damn!");
});
serve(app, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
