# IEClimbing Wiki Scraper

Standalone Node.js project that scrapes the Irish climbing wiki and exports normalized JSON intended to stay consistent with mobile-friendly data fields (`id`, `title`, `type`, `location`, `grades`, `description`, `metadata`).

## Usage

From `/home/runner/work/IEClimbing/IEClimbing/wiki-scraper`:

```bash
npm install
npm run scrape -- --base-url https://wiki.climbing.ie --start-path /wiki/Main_Page --max-pages 150 --pretty
```

Output defaults to `output/wiki-data.json`.

## Scripts

- `npm run build` - syntax check for source files
- `npm run lint` - syntax check for source and test files
- `npm test` - node test runner
- `npm run scrape` - run scraper and write JSON output

## CLI options

- `--base-url <url>`: wiki root URL (default: `https://wiki.climbing.ie`)
- `--start-path <paths>`: comma-separated wiki paths to seed crawling (default: `/wiki/Main_Page`)
- `--max-pages <number>`: crawl limit (default: `100`)
- `--delay-ms <number>`: delay between requests (default: `250`)
- `--out <file>`: output file path (default: `output/wiki-data.json`)
- `--pretty`: pretty-print JSON output
