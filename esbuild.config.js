import { copyFileSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import esbuild from "esbuild";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const define = { __REFLOW_VERSION__: JSON.stringify(pkg.version) };
const external = Object.keys(pkg.dependencies || {});

rmSync("dist", { recursive: true, force: true });

await Promise.all([
    // Browser: single self-contained file, exposes only `window.ReflowKit.init`.
    esbuild.build({
        entryPoints: ["src/browser.ts"],
        outfile: "dist/reflow.kit.min.js",
        bundle: true,
        define,
        platform: "browser",
        format: "iife",
        target: ["es2018"],
        minify: true
    }),

    // Browser, `defer`/`async`: inits itself on load and replays calls queued on `window.reflowkit`.
    esbuild.build({
        entryPoints: ["src/browser.async.ts"],
        outfile: "dist/reflow.kit.async.min.js",
        bundle: true,
        define,
        platform: "browser",
        format: "iife",
        target: ["es2018"],
        minify: true
    }),

    // npm: ESM + CJS, dependencies left external so consumers dedupe them.
    esbuild.build({
        entryPoints: ["src/index.ts"],
        outfile: "dist/index.js",
        bundle: true,
        define,
        external,
        platform: "browser",
        format: "esm",
        target: ["es2020"],
        sourcemap: true
    }),
    esbuild.build({
        entryPoints: ["src/index.ts"],
        outfile: "dist/index.cjs",
        bundle: true,
        define,
        external,
        platform: "browser",
        format: "cjs",
        target: ["es2020"],
        sourcemap: true
    })
]);

// Type declarations: one flat file, path aliases resolved.
execFileSync(
    "npx",
    [
        "dts-bundle-generator",
        "--project",
        "tsconfig.build.json",
        "--no-banner",
        "--export-referenced-types",
        "false",
        "-o",
        "dist/index.d.ts",
        "src/index.ts"
    ],
    { stdio: "inherit" }
);

copyFileSync("dist/index.d.ts", "dist/index.d.cts");

console.log("✅ Build complete");
