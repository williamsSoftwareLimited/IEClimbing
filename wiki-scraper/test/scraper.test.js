const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeEntity, extractWikiLinks } = require("../src/scraper");

test("normalizeEntity maps infobox fields to consistent shape", () => {
  const html = `
    <html>
      <head><title>The Example Route - Irish Climbing Wiki</title></head>
      <body>
        <h1 id="firstHeading">The Example Route</h1>
        <p>This is a classic route on perfect granite.</p>
        <table class="infobox">
          <tr><th>County</th><td>Donegal</td></tr>
          <tr><th>Region</th><td>Northwest</td></tr>
          <tr><th>French Grade</th><td>6a</td></tr>
          <tr><th>UK Technical Grade</th><td>4b</td></tr>
        </table>
      </body>
    </html>
  `;

  const item = normalizeEntity({
    pageUrl: "https://wiki.climbing.ie/wiki/The_Example_Route",
    pagePath: "/wiki/The_Example_Route",
    html,
  });

  assert.equal(item.title, "The Example Route");
  assert.equal(item.location.county, "Donegal");
  assert.equal(item.location.region, "Northwest");
  assert.equal(item.grades.french, "6a");
  assert.equal(item.grades.ukTechnical, "4b");
});

test("extractWikiLinks keeps internal wiki links and drops special pages", () => {
  const html = `
    <a href="/wiki/Main_Page">Main</a>
    <a href="/wiki/Category:Routes">Category</a>
    <a href="/wiki/Fairy_Castle">Fairy Castle</a>
    <a href="https://example.com">External</a>
  `;

  const links = extractWikiLinks(html, "https://wiki.climbing.ie");
  assert.deepEqual(links.sort(), ["/wiki/Fairy_Castle", "/wiki/Main_Page"]);
});
