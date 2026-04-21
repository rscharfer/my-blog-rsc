## Create a simple SSR rendered app

A server-side rendered app renders a document to return to the client when there is a request to the server

How I did it:
1. A Hono web server listens for a GET call to "/"
2. The listener passes the React component to `createElement` and the resulting React element to `renderToString` to turn the element into HTML
3. This listener returns HTML with the interpolated stringified React component to the client
4. The HTML that is returned to the server downloads a module called `hydrater.js` which hydrates the HTML returned from the server 


## New challenge:  Lets say the app needs data from an external source

How I did it:

1. The external source was JSON in the file systen
2. The endpoint that creates the app when a request is made first grabs the JSON data and then uses it when rendering the app to a string
3. An endpoint is set up for the client that reads from the file system and returns the exact same data
4. The client calls the API to grab the same data when it hyrdates it