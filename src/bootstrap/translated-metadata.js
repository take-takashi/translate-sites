function quoteValue(value) {
	return JSON.stringify(value ?? "");
}

function buildTranslatedMetadata(fields) {
	return {
		title: fields.title,
		source_url: fields.sourceUrl,
		raw_path: fields.rawPath,
		fetched_at: fields.fetchedAt,
		source_last_modified: fields.sourceLastModified,
		translated_at: fields.translatedAt,
		translator: fields.translator,
		raw_sha256: fields.rawSha256,
	};
}

function serializeFrontmatter(metadata) {
	const lines = ["---"];
	for (const [key, value] of Object.entries(metadata)) {
		if (value === undefined || value === null || value === "") {
			continue;
		}
		lines.push(`${key}: ${quoteValue(value)}`);
	}
	lines.push("---", "");
	return lines.join("\n");
}

function buildTranslatedDocument(metadataFields, body) {
	const metadata = buildTranslatedMetadata(metadataFields);
	return `${serializeFrontmatter(metadata)}${body.trim()}\n`;
}

module.exports = {
	buildTranslatedMetadata,
	serializeFrontmatter,
	buildTranslatedDocument,
};
