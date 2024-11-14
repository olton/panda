import { build } from "esbuild"
import progress from "@olton/esbuild-plugin-progress"
import { lessLoader } from 'esbuild-plugin-less'
import process from "node:process"

const isDev = process.env.MODE === "development"

await build({
    entryPoints: ["metro/index.js"],
    bundle: true,
    outfile: "src/metroui/metro.js",
    plugins: [
        progress({
            text: 'Building Metro UI...',
            succeedText: `Metro UI built successfully in %s ms!`
        }),
        lessLoader(),
    ],
    minify: true,
    sourcemap: isDev,
    format: "iife",
    target: ["es2015"],
})