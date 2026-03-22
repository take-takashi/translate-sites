const { loadSiteConfig } = require("./site-config");
const { buildRawPath, buildJaPath } = require("./storage-paths");
const { buildTranslatedMetadata, buildTranslatedDocument } = require("./translated-metadata");
const { createPageRecord, upsertPageRecord } = require("./state");

module.exports = {
	loadSiteConfig,
	buildRawPath,
	buildJaPath,
	buildTranslatedMetadata,
	buildTranslatedDocument,
	createPageRecord,
	upsertPageRecord,
};
