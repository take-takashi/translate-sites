const STATUS_PRIORITY = {
	skipped: 0,
	discovered: 1,
	"raw-only": 2,
	translated: 3,
};

function createPageRecord(fields) {
	const pageRecord = {
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

	if (fields.skipReason) {
		pageRecord.skip_reason = fields.skipReason;
	}

	return pageRecord;
}

function pickStatus(existingStatus, nextStatus) {
	const existingPriority = STATUS_PRIORITY[existingStatus] ?? -1;
	const nextPriority = STATUS_PRIORITY[nextStatus] ?? -1;
	return nextPriority >= existingPriority ? nextStatus : existingStatus;
}

function mergeNotes(existingNotes, nextNotes) {
	return [...new Set([...(existingNotes ?? []), ...(nextNotes ?? [])])];
}

function upsertPageRecord(state, pageRecord) {
	const pages = Array.isArray(state.pages) ? [...state.pages] : [];
	const index = pages.findIndex((page) => page.url === pageRecord.url);

	if (index >= 0) {
		const existing = pages[index];
		pages[index] = {
			...existing,
			...pageRecord,
			status: pickStatus(existing.status, pageRecord.status),
			notes: mergeNotes(existing.notes, pageRecord.notes),
			raw_path: pageRecord.raw_path ?? existing.raw_path,
			ja_path: pageRecord.ja_path ?? existing.ja_path,
			fetched_at: pageRecord.fetched_at ?? existing.fetched_at,
			translated_at: pageRecord.translated_at ?? existing.translated_at,
			source_last_modified: pageRecord.source_last_modified ?? existing.source_last_modified,
			raw_sha256: pageRecord.raw_sha256 ?? existing.raw_sha256,
			skip_reason: pageRecord.skip_reason ?? existing.skip_reason,
		};
	} else {
		pages.push(pageRecord);
	}

	return {
		...state,
		pages: pages.sort((left, right) => left.url.localeCompare(right.url)),
	};
}

module.exports = {
	createPageRecord,
	upsertPageRecord,
	internal: {
		pickStatus,
		mergeNotes,
	},
};
