const test = require("node:test");
const assert = require("node:assert/strict");

const { loadSiteConfig } = require("../src/bootstrap");
const {
	discoverSitePages,
	normalizeUrl,
	extractLinksFromHtml,
	applyDiscoveryToState,
	applyTranslatedPageToState,
} = require("../src/site-wide");

test("site-wide 用の optional config を読み取る", () => {
	const config = loadSiteConfig("sites/mise.yml");
	assert.deepEqual(config.includePathPrefixes, ["/"]);
	assert.deepEqual(config.excludePathPrefixes, ["/assets/", "/cdn-cgi/"]);
	assert.ok(config.excludeUrlPatterns.some((pattern) => pattern.includes("css")));
});

test("URL を正規化して重複を防ぐ", () => {
	assert.equal(normalizeUrl("/tasks", "https://mise.jdx.dev/"), "https://mise.jdx.dev/tasks/");
	assert.equal(normalizeUrl("/tasks/index.html", "https://mise.jdx.dev/"), "https://mise.jdx.dev/tasks/");
	assert.equal(normalizeUrl("/getting-started.html#intro", "https://mise.jdx.dev/"), "https://mise.jdx.dev/getting-started.html");
});

test("HTML から内部リンクを抽出する", () => {
	const links = extractLinksFromHtml(
		'<a href="/tasks/">Tasks</a><a href="https://mise.jdx.dev/environments/">Env</a>',
		"https://mise.jdx.dev/",
	);
	assert.deepEqual(links, ["https://mise.jdx.dev/tasks/", "https://mise.jdx.dev/environments/"]);
});

test("discovery で対象ページを列挙し除外を記録する", async () => {
	const config = loadSiteConfig("sites/mise.yml");
	const htmlByUrl = new Map([
		[
			"https://mise.jdx.dev/",
			[
				'<a href="/tasks/">Tasks</a>',
				'<a href="/environments/">Environments</a>',
				'<a href="/assets/style.css">Asset</a>',
				'<a href="https://github.com/jdx/mise">GitHub</a>',
			].join(""),
		],
		["https://mise.jdx.dev/tasks/", '<a href="/getting-started.html">Guide</a>'],
		["https://mise.jdx.dev/environments/", ""],
		["https://mise.jdx.dev/getting-started.html", ""],
	]);

	const discovery = await discoverSitePages(config, {
		fetchHtml: async (url) => htmlByUrl.get(url) ?? "",
	});

	assert.deepEqual(discovery.discovered, [
		"https://mise.jdx.dev/",
		"https://mise.jdx.dev/environments/",
		"https://mise.jdx.dev/getting-started.html",
		"https://mise.jdx.dev/tasks/",
	]);
	assert.ok(discovery.skipped.some((page) => page.url === "https://mise.jdx.dev/assets/style.css"));
	assert.ok(discovery.skipped.some((page) => page.reason === "disallowed-domain"));
});

test("discovery の state 反映で translated を維持する", () => {
	const config = loadSiteConfig("sites/mise.yml");
	const initialState = {
		site: "mise",
		display_name: "mise-en-place",
		pages: [
			{
				url: "https://mise.jdx.dev/tasks/",
				status: "translated",
				ja_path: "data/ja/mise/tasks/index.md",
				raw_path: "data/raw/mise/tasks/index.html",
				notes: ["主要本文を日本語 Markdown として保存済み"],
			},
		],
	};

	const discoveredState = applyDiscoveryToState(
		initialState,
		config,
		{
			discovered: ["https://mise.jdx.dev/tasks/", "https://mise.jdx.dev/environments/"],
			skipped: [{ url: "https://mise.jdx.dev/assets/style.css", reason: "excluded-url-pattern" }],
		},
		"2026-03-22T18:00:00Z",
	);

	const tasksPage = discoveredState.pages.find((page) => page.url === "https://mise.jdx.dev/tasks/");
	const skippedPage = discoveredState.pages.find((page) => page.url === "https://mise.jdx.dev/assets/style.css");
	assert.equal(tasksPage.status, "translated");
	assert.equal(skippedPage.status, "skipped");
	assert.equal(skippedPage.skip_reason, "excluded-url-pattern");
});

test("translated page を state へ反映できる", () => {
	const config = loadSiteConfig("sites/mise.yml");
	const state = { site: "mise", display_name: "mise-en-place", pages: [] };
	const updated = applyTranslatedPageToState(state, config, {
		url: "https://mise.jdx.dev/environments/",
		fetchedAt: "2026-03-22T06:20:27Z",
		translatedAt: "2026-03-22T16:08:49+0900",
		sourceLastModified: "Sun, 22 Mar 2026 05:55:58 GMT",
		rawSha256: "hash",
		translatedBody: "# Environments",
		notes: ["raw HTML を保存済み"],
	});

	const page = updated.pages[0];
	assert.equal(page.status, "translated");
	assert.equal(page.raw_path, "data/raw/mise/environments/index.html");
	assert.equal(page.ja_path, "data/ja/mise/environments/index.md");
});
