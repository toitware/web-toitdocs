// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// Reuse the CRA toolchain to compile the same components for Node.
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

function escapeHTML(value) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}

async function main() {
  const [buildArg, baseArg] = process.argv.slice(2);
  if (!buildArg || !baseArg)
    throw new Error(
      "Usage: node tools/prerender.cjs BUILD_DIR CANONICAL_BASE_URL"
    );
  const build = path.resolve(buildArg);
  const base = new URL(baseArg);
  if (!/^https?:$/.test(base.protocol) || base.search || base.hash) {
    throw new Error(
      "Canonical base must be an HTTP(S) URL without a query or fragment"
    );
  }
  if (!base.pathname.endsWith("/")) base.pathname += "/";
  const prefix = base.pathname.replace(/\/$/, "");
  const root = path.resolve(__dirname, "..");
  const cacheDir = path.join(root, "node_modules/.cache/toitdoc-prerender");
  await new Promise((resolve, reject) => {
    const compiler = webpack({
      mode: "production",
      target: "node",
      context: root,
      entry: "./src/prerender.tsx",
      output: {
        path: cacheDir,
        filename: "render.cjs",
        library: { type: "commonjs2" },
      },
      optimization: { minimize: false },
      resolve: { extensions: [".tsx", ".ts", ".js"] },
      externals: [
        ({ request }, callback) => {
          if (
            request &&
            !/\.(css|svg|png|woff)$/.test(request) &&
            !request.startsWith(".") &&
            !path.isAbsolute(request)
          ) {
            return callback(null, "commonjs " + require.resolve(request));
          }
          callback();
        },
      ],
      module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            include: path.join(root, "src"),
            use: {
              loader: require.resolve("babel-loader"),
              options: {
                presets: [
                  [
                    require.resolve("@babel/preset-react"),
                    { runtime: "automatic" },
                  ],
                  require.resolve("@babel/preset-typescript"),
                ],
              },
            },
          },
          { test: /\.css$/, type: "asset/source" },
          { test: /\.(svg|png|woff)$/, type: "asset/inline" },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.PUBLIC_URL": JSON.stringify(prefix || "/"),
        }),
      ],
    });
    compiler.run((error, stats) =>
      compiler.close((closeError) => {
        if (error || closeError) return reject(error || closeError);
        if (stats.hasErrors())
          return reject(
            new Error(stats.toString({ all: false, errors: true }))
          );
        resolve();
      })
    );
  });
  const data = JSON.parse(
    fs.readFileSync(path.join(build, "toitdoc.json"), "utf8")
  );
  const { renderer } = require(path.join(cacheDir, "render.cjs"));
  const site = renderer(data, base.href);
  // Read the fresh, portable viewer template. Keep it separate from generated
  // pages so package hosting can still reuse the regular build artifact.
  const template = fs.readFileSync(path.join(build, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>')) {
    throw new Error(
      "Expected a fresh viewer build; run yarn build before prerendering"
    );
  }
  const redirects = Object.entries(site.redirects);
  if (redirects.length > 2000)
    throw new Error("Cloudflare Pages supports at most 2000 static redirects");
  function writePage(route, file) {
    const result = site.render(route);
    const metadata =
      `<meta name="toitdoc-canonical-base" content="${escapeHTML(
        base.href
      )}">` +
      (result.canonical
        ? `<link rel="canonical" href="${escapeHTML(result.canonical)}">`
        : '<meta name="robots" content="noindex" data-toitdoc-robots>') +
      `<style data-toitdoc-static>${result.css}</style>`;
    const html = template
      .replace(
        /<title>.*?<\/title>/s,
        () => `<title>${escapeHTML(result.title)}</title>`
      )
      .replace(
        /<base[^>]*>/,
        () => `<base href="${escapeHTML(base.pathname)}">`
      )
      .replace(
        /<meta name="toitdoc-path"[^>]*>/,
        '<meta name="toitdoc-path" content="/toitdoc.json">'
      )
      .replace(/<noscript>.*?<\/noscript>/s, "")
      .replace("</head>", () => metadata + "</head>")
      .replace(
        '<div id="root"></div>',
        () => `<div id="root">${result.body}</div>`
      );
    const destination = path.resolve(build, file);
    if (!destination.startsWith(build + path.sep))
      throw new Error(`Invalid route: ${route}`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, html);
  }
  site.paths.forEach((route) =>
    writePage(route, route === "/" ? "index.html" : route.slice(1) + ".html")
  );
  writePage("/404", "404.html");
  fs.writeFileSync(
    path.join(build, "_redirects"),
    redirects
      .map(([from, to]) => `${prefix}${from} ${prefix}${to} 301`)
      .join("\n") + "\n"
  );
  const urls = site.paths.map((route) => new URL(route.slice(1), base).href);
  fs.writeFileSync(
    path.join(build, "sitemap.xml"),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map((url) => `<url><loc>${escapeHTML(url)}</loc></url>`).join("\n") +
      "\n</urlset>\n"
  );
  fs.appendFileSync(
    path.join(build, "robots.txt"),
    `\nSitemap: ${new URL("sitemap.xml", base).href}\n`
  );
  console.log(
    `Rendered ${site.paths.length} pages and ${redirects.length} aliases in ${build}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
