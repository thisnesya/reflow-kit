import esbuild from "esbuild";

esbuild
    .build({
        entryPoints: ["src/app.ts"],
        bundle: true,
        outfile: "dist/reflow.kit.min.js",
        platform: "browser",
        target: ["es2018"],
        sourcemap: true,
        minify: true
    })
    .catch(() => process.exit(1));
