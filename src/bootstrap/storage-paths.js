function buildRelativeContentPath(url, extension) {
	const parsed = new URL(url);
	let pathname = parsed.pathname;

	if (!pathname || pathname === "/") {
		return `index.${extension}`;
	}

	if (pathname.endsWith("/")) {
		return `${pathname.replace(/^\/+/, "")}index.${extension}`;
	}

	const trimmed = pathname.replace(/^\/+/, "");
	const lastSegment = trimmed.split("/").at(-1);
	if (lastSegment.includes(".")) {
		return trimmed.replace(/\.[^.]+$/, `.${extension}`);
	}

	return `${trimmed}.${extension}`;
}

function buildRawPath(siteConfig, url) {
	return `${siteConfig.rawDir}/${buildRelativeContentPath(url, "html")}`;
}

function buildJaPath(siteConfig, url) {
	return `${siteConfig.jaDir}/${buildRelativeContentPath(url, "md")}`;
}

module.exports = {
	buildRawPath,
	buildJaPath,
	internal: {
		buildRelativeContentPath,
	},
};
