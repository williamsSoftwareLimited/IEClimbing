const cheerio = require("cheerio");

const DEFAULT_BASE_URL = "https://wiki.climbing.ie";
const DEFAULT_START_PATHS = ["/wiki/Main_Page"];
const DEFAULT_MAX_PAGES = 100;
const DEFAULT_DELAY_MS = 250;

function normalizeWhitespace(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function toSlug(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function absoluteUrl(baseUrl, href) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function wikiPathFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith("/wiki/")) {
      return null;
    }
    if (parsed.pathname.includes(":")) {
      return null;
    }
    return `${parsed.pathname}${parsed.search || ""}`;
  } catch {
    return null;
  }
}

function extractTitle($, fallbackPath) {
  const heading = normalizeWhitespace($("#firstHeading").first().text());
  if (heading) {
    return heading;
  }

  const title = normalizeWhitespace($("title").first().text());
  if (title) {
    return title.split(" - ")[0];
  }

  return fallbackPath.replace("/wiki/", "").replace(/_/g, " ");
}

function extractDescription($) {
  for (const paragraph of $("p").toArray()) {
    const text = normalizeWhitespace($(paragraph).text());
    if (text.length > 40) {
      return text;
    }
  }
  return "";
}

function extractInfobox($) {
  const infobox = {};
  $("table.infobox tr").each((_index, row) => {
    const key = normalizeWhitespace($(row).find("th").first().text()).toLowerCase();
    const value = normalizeWhitespace($(row).find("td").first().text());
    if (key && value) {
      infobox[key] = value;
    }
  });
  return infobox;
}

function inferType(title, infobox) {
  const lowerTitle = title.toLowerCase();
  const infoboxKeys = Object.keys(infobox);
  if (infoboxKeys.some((key) => key.includes("grade") || key.includes("route"))) {
    return "route";
  }
  if (lowerTitle.includes("crag") || lowerTitle.includes("mountain")) {
    return "crag";
  }
  if (lowerTitle.includes("area") || lowerTitle.includes("county")) {
    return "area";
  }
  return "unknown";
}

function readField(infobox, keys) {
  for (const key of keys) {
    if (infobox[key]) {
      return infobox[key];
    }
  }
  return "";
}

function normalizeEntity({ pageUrl, pagePath, html }) {
  const $ = cheerio.load(html);
  const title = extractTitle($, pagePath);
  const infobox = extractInfobox($);
  const type = inferType(title, infobox);

  return {
    id: toSlug(title) || toSlug(pagePath),
    title,
    type,
    sourceUrl: pageUrl,
    location: {
      county: readField(infobox, ["county"]),
      region: readField(infobox, ["region", "location", "district"]),
      country: readField(infobox, ["country"]) || "Ireland",
    },
    grades: {
      french: readField(infobox, ["french grade", "french"]),
      ukTechnical: readField(infobox, ["uk technical grade", "uk technical"]),
      ukAdj: readField(infobox, ["uk adjectival grade", "uk adjectival"]),
      ewbanks: readField(infobox, ["ewbanks"]),
      font: readField(infobox, ["font", "font grade"]),
      vScale: readField(infobox, ["v grade", "v-scale", "v scale"]),
    },
    metadata: infobox,
    description: extractDescription($),
    scrapedAt: new Date().toISOString(),
  };
}

function extractWikiLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = new Set();
  $("a[href]").each((_index, link) => {
    const href = $(link).attr("href");
    const fullUrl = absoluteUrl(baseUrl, href);
    if (!fullUrl) {
      return;
    }
    const path = wikiPathFromUrl(fullUrl);
    if (path) {
      links.add(path);
    }
  });
  return [...links];
}

async function wait(delayMs) {
  if (!delayMs) {
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function fetchPage(url, userAgent) {
  const response = await fetch(url, {
    headers: {
      "user-agent": userAgent,
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function crawlWiki({
  baseUrl = DEFAULT_BASE_URL,
  startPaths = DEFAULT_START_PATHS,
  maxPages = DEFAULT_MAX_PAGES,
  delayMs = DEFAULT_DELAY_MS,
  userAgent = "IEClimbingWikiScraper/1.0 (+https://github.com/williamsSoftwareLimited/IEClimbing)",
} = {}) {
  const formattedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const queue = [...startPaths];
  const queued = new Set(queue);
  const visited = new Set();
  const items = [];
  const failures = [];

  while (queue.length > 0 && visited.size < maxPages) {
    const pagePath = queue.shift();
    queued.delete(pagePath);
    if (!pagePath || visited.has(pagePath)) {
      continue;
    }

    visited.add(pagePath);
    const pageUrl = absoluteUrl(formattedBaseUrl, pagePath);
    if (!pageUrl) {
      failures.push({ pagePath, reason: "Invalid URL" });
      continue;
    }

    try {
      const html = await fetchPage(pageUrl, userAgent);
      items.push(normalizeEntity({ pageUrl, pagePath, html }));

      const discoveredLinks = extractWikiLinks(html, formattedBaseUrl);
      for (const discoveredPath of discoveredLinks) {
        if (
          !visited.has(discoveredPath) &&
          !queued.has(discoveredPath) &&
          visited.size + queue.length < maxPages * 2
        ) {
          queue.push(discoveredPath);
          queued.add(discoveredPath);
        }
      }
    } catch (error) {
      failures.push({ pagePath, reason: error.message });
    }

    await wait(delayMs);
  }

  return {
    source: formattedBaseUrl.replace(/\/$/, ""),
    generatedAt: new Date().toISOString(),
    pageCount: items.length,
    visitedCount: visited.size,
    failures,
    items,
  };
}

module.exports = {
  DEFAULT_BASE_URL,
  DEFAULT_START_PATHS,
  DEFAULT_MAX_PAGES,
  DEFAULT_DELAY_MS,
  normalizeEntity,
  extractWikiLinks,
  crawlWiki,
};
