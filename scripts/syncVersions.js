#!/usr/bin/env zx

import { SingleBar, Presets } from "cli-progress";
import { versions, loaders } from "./consts.js";

$.verbose = false;

let packVersion = await $`cat .version`.quiet();
echo(`Pack version: ${packVersion}`);

let bar = new SingleBar(
	{
		format: " {bar} | {value}/{total} | {version} | {loader} | ETA: {eta}s",
		version: "Starting...",
		loader: "Starting...",
	},
	Presets.shades_classic
);

bar.start(versions.length * loaders.length, 0);

// For each version,
for (const version of versions) {
	for (const loader of loaders) {
		// Update the progress bar
		bar.update({ version, loader });
		// Check if the version folder exists
		if (!(await fs.exists(`${loader}/${version}`))) {
			await fs.mkdir(`${loader}/${version}`, { recursive: true });
		}
		cd(`${loader}/${version}`);
		let init = $`packwiz init -r --name Redstonality --author "Wyatt Stanke" --mc-version ${version} --version ${packVersion} --modloader=${loader} --${loader}-latest`;
		await init;
		cd("../../");
		bar.increment();
	}
}

bar.stop();
