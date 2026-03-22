const { discoverSitePages, getSkipReason, extractLinksFromHtml, normalizeUrl } = require("./discovery");
const {
	applyDiscoveryToState,
	applyTranslatedPageToState,
	buildSlugFromUrl,
	hashContents,
	loadStateFile,
	saveRawPage,
	saveStateFile,
	saveTranslatedPage,
} = require("./batch");

module.exports = {
	discoverSitePages,
	getSkipReason,
	extractLinksFromHtml,
	normalizeUrl,
	applyDiscoveryToState,
	applyTranslatedPageToState,
	buildSlugFromUrl,
	hashContents,
	loadStateFile,
	saveRawPage,
	saveStateFile,
	saveTranslatedPage,
};
