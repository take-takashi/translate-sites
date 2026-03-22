function normalizeUrl(url, baseUrl) {
	const parsed = new URL(url, baseUrl);

	if (!["http:", "https:"].includes(parsed.protocol)) {
		return null;
	}

	parsed.hash = "";
	parsed.search = "";

	if (parsed.pathname === "") {
		parsed.pathname = "/";
	}

	parsed.pathname = parsed.pathname.replace(/\/{2,}/g, "/");

	if (parsed.pathname !== "/" && parsed.pathname.endsWith("/index.html")) {
		parsed.pathname = parsed.pathname.replace(/\/index\.html$/, "/");
	} else if (!parsed.pathname.endsWith("/") && !/\.[A-Za-z0-9]+$/.test(parsed.pathname)) {
		parsed.pathname = `${parsed.pathname}/`;
	}

	return parsed.toString();
}

function extractLinksFromHtml(html, baseUrl) {
	const links = [];
	const hrefPattern = /href=(?:"([^"]+)"|'([^']+)')/g;
	let match;

	while ((match = hrefPattern.exec(html)) !== null) {
		const rawHref = match[1] ?? match[2];
		const normalized = normalizeUrl(rawHref, baseUrl);
		if (normalized) {
			links.push(normalized);
		}
	}

	return links;
}

function getSkipReason(siteConfig, url) {
	const parsed = new URL(url);

	if (!siteConfig.allowedDomains.includes(parsed.hostname)) {
		return "disallowed-domain";
	}

	if (!siteConfig.includePathPrefixes.some((prefix) => parsed.pathname.startsWith(prefix))) {
		return "outside-include-prefix";
	}

	if (siteConfig.excludePathPrefixes.some((prefix) => parsed.pathname.startsWith(prefix))) {
		return "excluded-path-prefix";
	}

	for (const pattern of siteConfig.excludeUrlPatterns) {
		if (new RegExp(pattern).test(url)) {
			return "excluded-url-pattern";
		}
	}

	return null;
}

async function discoverSitePages(siteConfig, options = {}) {
	const fetchHtml = options.fetchHtml ?? (async (url) => {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${url}: ${response.status}`);
		}
		return response.text();
	});
	const normalizedEntries = siteConfig.entryUrls.map((url) => normalizeUrl(url, url)).filter(Boolean);
	const queue = [...normalizedEntries];
	const visited = new Set();
	const discovered = new Set();
	const skipped = new Map();

	while (queue.length > 0) {
		const currentUrl = queue.shift();
		if (visited.has(currentUrl)) {
			continue;
		}
		visited.add(currentUrl);

		const currentSkipReason = getSkipReason(siteConfig, currentUrl);
		if (currentSkipReason) {
			skipped.set(currentUrl, currentSkipReason);
			continue;
		}

		discovered.add(currentUrl);

		const html = await fetchHtml(currentUrl);
		for (const link of extractLinksFromHtml(html, currentUrl)) {
			if (visited.has(link)) {
				continue;
			}

			const skipReason = getSkipReason(siteConfig, link);
			if (skipReason) {
				skipped.set(link, skipReason);
				continue;
			}

			queue.push(link);
		}
	}

	return {
		discovered: [...discovered].sort(),
		skipped: [...skipped.entries()]
			.map(([url, reason]) => ({ url, reason }))
			.sort((left, right) => left.url.localeCompare(right.url)),
	};
}

module.exports = {
	discoverSitePages,
	getSkipReason,
	extractLinksFromHtml,
	normalizeUrl,
};
