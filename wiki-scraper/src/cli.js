const fs = require("node:fs/promises");
const path = require("node:path");
const {
  crawlWiki,
  DEFAULT_BASE_URL,
  DEFAULT_START_PATHS,
  DEFAULT_MAX_PAGES,
  DEFAULT_DELAY_MS,
} = require("./scraper");

function parseArgs(argv) {
  const config = {
    baseUrl: DEFAULT_BASE_URL,
    startPaths: [...DEFAULT_START_PATHS],
    maxPages: DEFAULT_MAX_PAGES,
    delayMs: DEFAULT_DELAY_MS,
    out: path.resolve(process.cwd(), "output", "wiki-data.json"),
    pretty: false,
  };

  for (let argIndex = 0; argIndex < argv.length; argIndex += 1) {
    const arg = argv[argIndex];
    const next = argv[argIndex + 1];

    if (arg === "--base-url" && next) {
      config.baseUrl = next;
      argIndex += 1;
      continue;
    }
    if (arg === "--start-path" && next) {
      config.startPaths = next
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      argIndex += 1;
      continue;
    }
    if (arg === "--max-pages" && next) {
      config.maxPages = Number(next);
      argIndex += 1;
      continue;
    }
    if (arg === "--delay-ms" && next) {
      config.delayMs = Number(next);
      argIndex += 1;
      continue;
    }
    if (arg === "--out" && next) {
      config.out = path.resolve(process.cwd(), next);
      argIndex += 1;
      continue;
    }
    if (arg === "--pretty") {
      config.pretty = true;
      continue;
    }
  }

  return config;
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  const payload = await crawlWiki({
    baseUrl: options.baseUrl,
    startPaths: options.startPaths,
    maxPages: options.maxPages,
    delayMs: options.delayMs,
  });

  await fs.mkdir(path.dirname(options.out), { recursive: true });
  await fs.writeFile(
    options.out,
    JSON.stringify(payload, null, options.pretty ? 2 : 0),
    "utf8"
  );

  process.stdout.write(
    `Scraped ${payload.pageCount} pages from ${payload.source}\nOutput: ${options.out}\n`
  );
}

run().catch((error) => {
  process.stderr.write(`Scrape failed: ${error.message}\n`);
  process.exitCode = 1;
});
