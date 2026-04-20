import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const [server, client] = await Promise.all([
  esbuild.context({
    entryPoints: ["server/index.ts"],
    bundle: true,
    platform: "node",
    packages: "external",
    format: "esm",
    outfile: "dist/server.js",
  }),
  esbuild.context({
    entryPoints: ["src/hydrater.ts"],
    bundle: true,
    platform: "browser",
    external: ["react", "react-dom/client"],
    format: "esm",
    outfile: "public/hydrater.js",
  }),
]);

if (watch) {
  await Promise.all([server.watch(), client.watch()]);
  console.log("watching for changes...");
} else {
  await Promise.all([server.rebuild(), client.rebuild()]);
  await Promise.all([server.dispose(), client.dispose()]);
}
