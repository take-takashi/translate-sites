const fs = require("node:fs");
const path = require("node:path");

const REQUIRED_FIELDS = [
	"name",
	"display_name",
	"entry_urls",
	"allowed_domains",
	"raw_dir",
	"ja_dir",
	"state_file",
];

const OPTIONAL_ARRAY_FIELDS = [
	"include_path_prefixes",
	"exclude_path_prefixes",
	"exclude_url_patterns",
];

function parseScalar(value) {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function parseSimpleYaml(contents) {
	const result = {};
	let currentArrayKey = null;

	for (const rawLine of contents.split(/\r?\n/)) {
		const line = rawLine.replace(/\t/g, "    ");
		const trimmed = line.trim();

		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		if (/^\s*-\s+/.test(line)) {
			if (!currentArrayKey) {
				throw new Error(`Invalid list item without key: ${trimmed}`);
			}
			result[currentArrayKey].push(parseScalar(trimmed.replace(/^-+\s+/, "")));
			continue;
		}

		const match = trimmed.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/);
		if (!match) {
			throw new Error(`Unsupported YAML line: ${trimmed}`);
		}

		const [, key, rest = ""] = match;
		if (rest === "") {
			result[key] = [];
			currentArrayKey = key;
			continue;
		}

		result[key] = parseScalar(rest);
		currentArrayKey = null;
	}

	return result;
}

function validateSiteConfig(config) {
	const missingFields = REQUIRED_FIELDS.filter((field) => {
		const value = config[field];
		if (Array.isArray(value)) {
			return value.length === 0;
		}

		return !value;
	});

	if (missingFields.length > 0) {
		throw new Error(`Missing required site config fields: ${missingFields.join(", ")}`);
	}

	for (const field of OPTIONAL_ARRAY_FIELDS) {
		if (field in config && !Array.isArray(config[field])) {
			throw new Error(`Optional site config field must be an array: ${field}`);
		}
	}
}

function normalizeSiteConfig(config, filePath) {
	return {
		name: config.name,
		displayName: config.display_name,
		entryUrls: [...config.entry_urls],
		allowedDomains: [...config.allowed_domains],
		rawDir: config.raw_dir,
		jaDir: config.ja_dir,
		stateFile: config.state_file,
		includePathPrefixes: [...(config.include_path_prefixes ?? ["/"])],
		excludePathPrefixes: [...(config.exclude_path_prefixes ?? [])],
		excludeUrlPatterns: [...(config.exclude_url_patterns ?? [])],
		filePath,
	};
}

function loadSiteConfig(filePath) {
	const absolutePath = path.resolve(filePath);
	const parsed = parseSimpleYaml(fs.readFileSync(absolutePath, "utf8"));
	validateSiteConfig(parsed);
	return normalizeSiteConfig(parsed, filePath);
}

module.exports = {
	REQUIRED_FIELDS,
	OPTIONAL_ARRAY_FIELDS,
	loadSiteConfig,
	internal: {
		parseSimpleYaml,
		validateSiteConfig,
		normalizeSiteConfig,
	},
};
