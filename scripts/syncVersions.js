#!/usr/bin/env zx

import { SingleBar, Presets } from "cli-progress";
import { versions } from "./versions.js";

$.verbose = false;

let packVersion = await $`cat .version`.quiet();
echo(`Pack version: ${packVersion}`);

let bar = new SingleBar(
	{
		format: " {bar} | {value}/{total} | {version} | ETA: {eta}s",
		version: "Starting...",
	},
	Presets.shades_classic,
);

bar.start(versions.length, 0);

// For each version,
for (const version of versions) {
	// Update the progress bar
	bar.update({ version: version });
	if (version === ".DS_Store") continue; // Macos moment
	// Check if the version folder exists
	if (!(await fs.exists(`quilt/${version}`))) {
		await fs.mkdir(`quilt/${version}`, { recursive: true });
	}
	cd(`quilt/${version}`);
	let init = $`packwiz init -r --name Redstonality --author "Wyatt Stanke" --mc-version ${version} --version ${packVersion} --modloader quilt --quilt-latest`;
	await init;
	cd("../../");
	bar.increment();
}

bar.stop();
