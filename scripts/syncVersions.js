#!/usr/bin/env zx

// TODO - wait for google/zx#605
// List of versions to make modpacks for (1.15.2 to 1.19.4)
const versions = [
	"1.15.2",
	"1.16.1",
	"1.16.2",
	"1.16.3",
	"1.16.4",
	"1.16.5",
	"1.17",
	"1.17.1",
	"1.18",
	"1.18.1",
	"1.18.2",
	"1.19",
	"1.19.1",
	"1.19.2",
	"1.19.3",
	"1.19.4",
];

let packVersion = await $`cat .version`.quiet();
echo(`Pack version: ${packVersion}`);

// For each version,
for (const version of versions) {
	// Check if the version folder exists
	if (await fs.exists(`quilt/${version}`)) {
		// If it does, skip it
		echo(`Skipping ${version} as it already exists`);
		// If it doesn't,
	} else {
		// Create the folder
		await fs.mkdir(`quilt/${version}`, { recursive: true });
		// Change to the folder
		cd(`quilt/${version}`);
		// Initialize the modpack by writing the pack.toml file
	}
	let init = $`packwiz init -r --name Redstonality --author "Wyatt Stanke" --mc-version "${version}" --version "${packVersion}" --modloader quilt --quilt-latest`;
	await init;
	cd("../../");
}
