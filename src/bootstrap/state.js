function createPageRecord(fields) {
	return {
		url: fields.url,
		slug: fields.slug,
		status: fields.status,
		raw_path: fields.rawPath,
		ja_path: fields.jaPath,
		fetched_at: fields.fetchedAt,
		translated_at: fields.translatedAt,
		source_last_modified: fields.sourceLastModified,
		raw_sha256: fields.rawSha256,
		notes: fields.notes ?? [],
	};
}

function upsertPageRecord(state, pageRecord) {
	const pages = Array.isArray(state.pages) ? [...state.pages] : [];
	const index = pages.findIndex((page) => page.url === pageRecord.url);

	if (index >= 0) {
		pages[index] = { ...pages[index], ...pageRecord };
	} else {
		pages.push(pageRecord);
	}

	return {
		...state,
		pages,
	};
}

module.exports = {
	createPageRecord,
	upsertPageRecord,
};
