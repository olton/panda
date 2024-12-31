import { context } from "esbuild"
import progress from "@olton/esbuild-plugin-progress"
import { lessLoader } from 'esbuild-plugin-less'
import {replace} from "esbuild-plugin-replace";
import process from "node:process"
import pkg from "@olton/metroui/package.json" with { type: "json" }

const isDev = process.env.MODE === "development"

let ctx = await context({
    entryPoints: ["metro/index.js"],
    bundle: true,
    outfile: "src/metroui/metro.js",
    plugins: [
        progress({
            text: 'Building Metro UI...',
            succeedText: `Metro UI built successfully in %s ms! Waiting for changes...`
        }),
        lessLoader(),
        replace({
            '__BUILD_TIME__': new Date().toLocaleString(),
            '__VERSION__': pkg.version,
        })
    ],
    minify: true,
    sourcemap: isDev,
    format: "iife",
    target: ["es2015"],
})

await Promise.all([
    ctx.watch()
])