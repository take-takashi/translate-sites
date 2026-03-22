const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const { buildRawPath, buildJaPath } = require("../bootstrap/storage-paths");
const { buildTranslatedDocument } = require("../bootstrap/translated-metadata");
const { createPageRecord, upsertPageRecord } = require("../bootstrap/state");

function ensureParentDirectory(filePath) {
	fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}

function buildSlugFromUrl(url) {
	const parsed = new URL(url);
	if (!parsed.pathname || parsed.pathname === "/") {
		return "index";
	}

	return parsed.pathname
		.replace(/^\/+/, "")
		.replace(/\/$/, "")
		.replace(/\/index\.html$/, "")
		.replace(/\.[^.]+$/, "")
		.replace(/\//g, "-");
}

function hashContents(contents) {
	return crypto.createHash("sha256").update(contents).digest("hex");
}

function saveRawPage(siteConfig, page) {
	const rawPath = buildRawPath(siteConfig, page.url);
	ensureParentDirectory(rawPath);
	fs.writeFileSync(path.resolve(rawPath), page.html);
	return rawPath;
}

function saveTranslatedPage(siteConfig, page, translatedBody) {
	const jaPath = buildJaPath(siteConfig, page.url);
	ensureParentDirectory(jaPath);
	const document = buildTranslatedDocument(
		{
			title: page.title,
			sourceUrl: page.url,
			rawPath: buildRawPath(siteConfig, page.url),
			fetchedAt: page.fetchedAt,
			sourceLastModified: page.sourceLastModified,
			translatedAt: page.translatedAt,
			translator: page.translator,
			rawSha256: page.rawSha256,
		},
		translatedBody,
	);
	fs.writeFileSync(path.resolve(jaPath), document);
	return jaPath;
}

function applyDiscoveryToState(state, siteConfig, discoveryResult, updatedAt) {
	let nextState = {
		site: state.site ?? siteConfig.name,
		display_name: state.display_name ?? siteConfig.displayName,
		updated_at: updatedAt,
		pages: Array.isArray(state.pages) ? state.pages : [],
	};

	for (const url of discoveryResult.discovered) {
		nextState = upsertPageRecord(
			nextState,
			createPageRecord({
				url,
				slug: buildSlugFromUrl(url),
				status: "discovered",
				notes: ["site-wide discovery で検出済み"],
			}),
		);
	}

	for (const skippedPage of discoveryResult.skipped) {
		if (skippedPage.reason === "disallowed-domain") {
			continue;
		}

		nextState = upsertPageRecord(
			nextState,
			createPageRecord({
				url: skippedPage.url,
				slug: buildSlugFromUrl(skippedPage.url),
				status: "skipped",
				skipReason: skippedPage.reason,
				notes: ["site-wide discovery で対象外と判定した"],
			}),
		);
	}

	return {
		...nextState,
		updated_at: updatedAt,
	};
}

function applyTranslatedPageToState(state, siteConfig, page) {
	return upsertPageRecord(
		{
			...state,
			updated_at: page.translatedAt ?? page.fetchedAt,
		},
		createPageRecord({
			url: page.url,
			slug: buildSlugFromUrl(page.url),
			status: page.translatedBody ? "translated" : "raw-only",
			rawPath: buildRawPath(siteConfig, page.url),
			jaPath: page.translatedBody ? buildJaPath(siteConfig, page.url) : undefined,
			fetchedAt: page.fetchedAt,
			translatedAt: page.translatedAt,
			sourceLastModified: page.sourceLastModified,
			rawSha256: page.rawSha256,
			notes: page.notes,
		}),
	);
}

function loadStateFile(stateFile) {
	if (!fs.existsSync(path.resolve(stateFile))) {
		return { pages: [] };
	}
	return JSON.parse(fs.readFileSync(path.resolve(stateFile), "utf8"));
}

function saveStateFile(stateFile, state) {
	ensureParentDirectory(stateFile);
	fs.writeFileSync(path.resolve(stateFile), `${JSON.stringify(state, null, 2)}\n`);
}

module.exports = {
	applyDiscoveryToState,
	applyTranslatedPageToState,
	buildSlugFromUrl,
	hashContents,
	loadStateFile,
	saveRawPage,
	saveStateFile,
	saveTranslatedPage,
};
