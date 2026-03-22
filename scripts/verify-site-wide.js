const assert = require("node:assert/strict");

const { loadSiteConfig } = require("../src/bootstrap");
const { discoverSitePages, applyDiscoveryToState, loadStateFile } = require("../src/site-wide");

async function main() {
	const config = loadSiteConfig("sites/mise.yml");
	const discovery = await discoverSitePages(config);

	assert.ok(discovery.discovered.includes("https://mise.jdx.dev/tasks/"));
	assert.ok(discovery.discovered.includes("https://mise.jdx.dev/environments/"));
	assert.ok(discovery.discovered.includes("https://mise.jdx.dev/getting-started.html"));
	assert.ok(discovery.discovered.length >= 20);
	assert.ok(discovery.skipped.some((page) => page.url === "https://mise.jdx.dev/assets/style.c7csQnOq.css"));
	assert.ok(discovery.skipped.some((page) => page.reason === "excluded-path-prefix"));
	assert.ok(discovery.skipped.some((page) => page.reason === "disallowed-domain"));

	const state = loadStateFile(config.stateFile);
	const nextState = applyDiscoveryToState(state, config, discovery, state.updated_at ?? new Date().toISOString());
	const tasksPage = nextState.pages.find((page) => page.url === "https://mise.jdx.dev/tasks/");
	const environmentsPage = nextState.pages.find((page) => page.url === "https://mise.jdx.dev/environments/");

	assert.equal(tasksPage.status, "translated");
	assert.equal(environmentsPage.status, "translated");

	process.stdout.write(
		JSON.stringify(
			{
				discovered: discovery.discovered.length,
				skipped: discovery.skipped.length,
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
