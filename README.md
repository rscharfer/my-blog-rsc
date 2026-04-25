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


## New challenge:  Write my own getStaticProps implementation.  **APIs include `readDir`, `readFile`, `path`'s `join`, and `dirEntr`**

How I did it:

1. create a function which recursively looks in the "posts" folder, and then either:
    1. "processes" the files in the folder
    2.  or looks in the folder the and does the same

    How does it process the file?

    It processes the file by creating an of the data type ProcessedFile, which is an object with frontmatter, content, tags, and slug

## New Challenge: Render the index page
