## Create a simple SSR rendered app

A server-side rendered app renders a document to return to the client when there is a request to the server

How I did it:
1. A Hono web server listens for a GET call to "/"
2. The listener passes the React component to `createElement` and the resulting React element to `renderToString` to turn the element into HTML
3. This listener returns HTML with the interpolated stringified React component to the client
4. The HTML that is returned to the server downloads a module called `hydrater.js` which hydrates the HTML returned from the server 

