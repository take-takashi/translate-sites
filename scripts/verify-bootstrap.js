const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const {
	loadSiteConfig,
	buildRawPath,
	buildJaPath,
	buildTranslatedMetadata,
	createPageRecord,
	upsertPageRecord,
} = require("../src/bootstrap");

function parseFrontmatter(document) {
	const match = document.match(/^---\n([\s\S]*?)\n---\n/);
	if (!match) {
		throw new Error("Frontmatter not found");
	}

	const metadata = {};
	for (const line of match[1].split("\n")) {
		const separator = line.indexOf(":");
		const key = line.slice(0, separator);
		const value = JSON.parse(line.slice(separator + 1).trim());
		metadata[key] = value;
	}
	return metadata;
}

function main() {
	const config = loadSiteConfig("sites/mise.yml");
	assert.equal(config.name, "mise");
	assert.deepEqual(config.entryUrls, [
		"https://mise.jdx.dev/",
		"https://mise.jdx.dev/tasks/",
		"https://mise.jdx.dev/environments/",
	]);

	const tasksUrl = "https://mise.jdx.dev/tasks/";
	assert.equal(buildRawPath(config, tasksUrl), "data/raw/mise/tasks/index.html");
	assert.equal(buildJaPath(config, tasksUrl), "data/ja/mise/tasks/index.md");
	const environmentsUrl = "https://mise.jdx.dev/environments/";
	assert.equal(buildRawPath(config, environmentsUrl), "data/raw/mise/environments/index.html");
	assert.equal(buildJaPath(config, environmentsUrl), "data/ja/mise/environments/index.md");

	const translatedDocument = fs.readFileSync(path.resolve("data/ja/mise/tasks/index.md"), "utf8");
	const metadata = parseFrontmatter(translatedDocument);
	const expectedMetadata = buildTranslatedMetadata({
		title: "Tasks",
		sourceUrl: tasksUrl,
		rawPath: "data/raw/mise/tasks/index.html",
		fetchedAt: "2026-03-21T23:49:32Z",
		sourceLastModified: "Sat, 21 Mar 2026 22:23:50 GMT",
		translatedAt: "2026-03-22T08:49:32+0900",
		translator: "OpenAI Codex",
		rawSha256: "04e4d8907679eb60efd1e5467ba35262f663b29a72600b346549ca3b679e2f5a",
	});
	assert.deepEqual(metadata, expectedMetadata);

	const state = JSON.parse(fs.readFileSync(path.resolve("data/state/mise.json"), "utf8"));
	const updatedState = upsertPageRecord(
		{ site: state.site, display_name: state.display_name, updated_at: state.updated_at, pages: [] },
		createPageRecord({
			url: tasksUrl,
			slug: "tasks",
			status: "translated",
			rawPath: "data/raw/mise/tasks/index.html",
			jaPath: "data/ja/mise/tasks/index.md",
			fetchedAt: "2026-03-21T23:49:32Z",
			translatedAt: "2026-03-22T08:49:32+0900",
			sourceLastModified: "Sat, 21 Mar 2026 22:23:50 GMT",
			rawSha256: "04e4d8907679eb60efd1e5467ba35262f663b29a72600b346549ca3b679e2f5a",
			notes: [
				"raw HTML を保存済み",
				"主要本文を日本語 Markdown として保存済み",
				"サイドバーや前後ページナビゲーションは翻訳対象から外した",
			],
		}),
	);
	const updatedStateWithEnvironments = upsertPageRecord(
		updatedState,
		createPageRecord({
			url: environmentsUrl,
			slug: "environments",
			status: "translated",
			rawPath: "data/raw/mise/environments/index.html",
			jaPath: "data/ja/mise/environments/index.md",
			fetchedAt: "2026-03-22T06:20:27Z",
			translatedAt: "2026-03-22T16:08:49+0900",
			sourceLastModified: "Sun, 22 Mar 2026 05:55:58 GMT",
			rawSha256: "7b012eea7d0ffc0feefe5da026991b0a39a6d9b09be8f66d5aac3ada368b7f7b",
			notes: [
				"raw HTML を保存済み",
				"主要本文を日本語 Markdown として保存済み",
				"サイドバーや前後ページナビゲーションは翻訳対象から外した",
			],
		}),
	);
	const sortPages = (pages) => [...pages].sort((left, right) => left.url.localeCompare(right.url));
	const translatedPages = state.pages.filter((page) => page.status === "translated");
	assert.equal(sortPages(updatedStateWithEnvironments.pages).length, sortPages(translatedPages).length);
	for (const expectedPage of sortPages(updatedStateWithEnvironments.pages)) {
		const actualPage = translatedPages.find((page) => page.url === expectedPage.url);
		assert.ok(actualPage, `translated page not found: ${expectedPage.url}`);
		assert.equal(actualPage.status, expectedPage.status);
		assert.equal(actualPage.raw_path, expectedPage.raw_path);
		assert.equal(actualPage.ja_path, expectedPage.ja_path);
		assert.equal(actualPage.fetched_at, expectedPage.fetched_at);
		assert.equal(actualPage.translated_at, expectedPage.translated_at);
		assert.equal(actualPage.source_last_modified, expectedPage.source_last_modified);
		assert.equal(actualPage.raw_sha256, expectedPage.raw_sha256);
		for (const note of expectedPage.notes) {
			assert.ok(actualPage.notes.includes(note), `missing note for ${expectedPage.url}: ${note}`);
		}
	}

	process.stdout.write("bootstrap verification passed\n");
}

main();
