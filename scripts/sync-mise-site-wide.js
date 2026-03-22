const fs = require("node:fs");
const path = require("node:path");

const { loadSiteConfig } = require("../src/bootstrap");
const {
	discoverSitePages,
	applyDiscoveryToState,
	applyTranslatedPageToState,
	hashContents,
	loadStateFile,
	saveStateFile,
} = require("../src/site-wide");

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

function collectExistingTranslatedPages(siteConfig) {
	return [
		{
			url: "https://mise.jdx.dev/tasks/",
			title: "Tasks",
			rawPath: "data/raw/mise/tasks/index.html",
			jaPath: "data/ja/mise/tasks/index.md",
		},
		{
			url: "https://mise.jdx.dev/environments/",
			title: "Environments",
			rawPath: "data/raw/mise/environments/index.html",
			jaPath: "data/ja/mise/environments/index.md",
		},
	].map((page) => {
		const translatedDocument = fs.readFileSync(path.resolve(page.jaPath), "utf8");
		const metadata = parseFrontmatter(translatedDocument);
		const rawHtml = fs.readFileSync(path.resolve(page.rawPath), "utf8");

		return {
			url: page.url,
			title: page.title,
			fetchedAt: metadata.fetched_at,
			translatedAt: metadata.translated_at,
			sourceLastModified: metadata.source_last_modified,
			rawSha256: hashContents(rawHtml),
			translatedBody: translatedDocument.replace(/^---\n[\s\S]*?\n---\n/, ""),
			notes: [
				"raw HTML を保存済み",
				"主要本文を日本語 Markdown として保存済み",
				"サイドバーや前後ページナビゲーションは翻訳対象から外した",
			],
			siteConfig,
		};
	});
}

async function main() {
	const siteConfig = loadSiteConfig("sites/mise.yml");
	const discovery = await discoverSitePages(siteConfig);
	const now = new Date().toISOString().replace(".000Z", "Z");
	const existingState = loadStateFile(siteConfig.stateFile);
	let state = {
		site: existingState.site ?? siteConfig.name,
		display_name: existingState.display_name ?? siteConfig.displayName,
		updated_at: existingState.updated_at,
		pages: (existingState.pages ?? []).filter(
			(page) => page.status === "translated" || page.status === "raw-only",
		),
	};
	state = applyDiscoveryToState(state, siteConfig, discovery, now);

	for (const page of collectExistingTranslatedPages(siteConfig)) {
		state = applyTranslatedPageToState(state, siteConfig, page);
	}

	state.updated_at = now;

	saveStateFile(siteConfig.stateFile, state);

	process.stdout.write(
		JSON.stringify(
			{
				discovered: discovery.discovered.length,
				skipped: discovery.skipped.length,
				statePages: state.pages.length,
			},
			null,
			2,
		) + "\n",
	);
}

main().catch((error) => {
	process.stderr.write(`${error.stack}\n`);
	process.exitCode = 1;
});
