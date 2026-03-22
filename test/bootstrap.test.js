const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
	loadSiteConfig,
	buildRawPath,
	buildJaPath,
	buildTranslatedMetadata,
	buildTranslatedDocument,
	createPageRecord,
	upsertPageRecord,
} = require("../src/bootstrap");

test("site config を読み取り必須項目を検証する", () => {
	const config = loadSiteConfig("sites/mise.yml");
	assert.equal(config.name, "mise");
	assert.equal(config.displayName, "mise-en-place");
	assert.deepEqual(config.entryUrls, [
		"https://mise.jdx.dev/tasks/",
		"https://mise.jdx.dev/environments/",
	]);
});

test("必須項目不足の site config を弾く", () => {
	const brokenPath = ".tmp-broken-site.yml";
	fs.writeFileSync(brokenPath, "name: broken\nentry_urls:\n  - https://example.com/\n");
	assert.throws(() => loadSiteConfig(brokenPath), /Missing required site config fields/);
	fs.unlinkSync(brokenPath);
});

test("source URL から raw / ja path を決定する", () => {
	const config = loadSiteConfig("sites/mise.yml");
	const url = "https://mise.jdx.dev/tasks/";
	assert.equal(buildRawPath(config, url), "data/raw/mise/tasks/index.html");
	assert.equal(buildJaPath(config, url), "data/ja/mise/tasks/index.md");
});

test("翻訳済み metadata を組み立てる", () => {
	const metadata = buildTranslatedMetadata({
		title: "Tasks",
		sourceUrl: "https://mise.jdx.dev/tasks/",
		rawPath: "data/raw/mise/tasks/index.html",
		fetchedAt: "2026-03-21T23:49:32Z",
		sourceLastModified: "Sat, 21 Mar 2026 22:23:50 GMT",
		translatedAt: "2026-03-22T08:49:32+0900",
		translator: "OpenAI Codex",
		rawSha256: "hash",
	});

	assert.equal(metadata.source_url, "https://mise.jdx.dev/tasks/");
	assert.equal(metadata.raw_path, "data/raw/mise/tasks/index.html");
	assert.equal(metadata.raw_sha256, "hash");
});

test("翻訳済み document を frontmatter 付きで生成する", () => {
	const document = buildTranslatedDocument(
		{
			title: "Tasks",
			sourceUrl: "https://mise.jdx.dev/tasks/",
			rawPath: "data/raw/mise/tasks/index.html",
			fetchedAt: "2026-03-21T23:49:32Z",
			translatedAt: "2026-03-22T08:49:32+0900",
			translator: "OpenAI Codex",
			rawSha256: "hash",
		},
		"# Tasks",
	);

	assert.match(document, /^---/);
	assert.match(document, /source_url: "https:\/\/mise\.jdx\.dev\/tasks\/"/);
	assert.match(document, /# Tasks/);
});

test("state page record を追加・更新する", () => {
	const state = { site: "mise", pages: [{ url: "https://example.com/", status: "raw-only" }] };
	const record = createPageRecord({
		url: "https://mise.jdx.dev/tasks/",
		slug: "tasks",
		status: "translated",
		rawPath: "data/raw/mise/tasks/index.html",
		jaPath: "data/ja/mise/tasks/index.md",
		fetchedAt: "2026-03-21T23:49:32Z",
		translatedAt: "2026-03-22T08:49:32+0900",
		rawSha256: "hash",
	});

	const updated = upsertPageRecord(state, record);
	assert.equal(updated.pages.length, 2);
	assert.deepEqual(updated.pages[0], state.pages[0]);
	assert.equal(updated.pages[1].url, "https://mise.jdx.dev/tasks/");
});
