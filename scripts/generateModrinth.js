#!/usr/bin/env zx
import { SingleBar, Presets } from "cli-progress";
import { versions, loaders } from "./consts.js";

const bar = new SingleBar(
	{
		format: " {bar} | {value}/{total} | {version} | {loader} | ETA: {eta}s",
		version: "Starting...",
		loader: "Starting...",
	},
	Presets.shades_classic
);

$.verbose = false;
let packVersion = await $`cat .version`.quiet();
await $`mkdir -p out/`;
bar.start(versions.length * loaders.length, 0);
for (const version of versions) {
	for (const loader of loaders) {
		bar.update({ version, loader });
		cd(`${loader}/${version}`);
		await $`rm -rf *.mrpack`;
		await $`packwiz modrinth export -y`;
		await $`mv *.mrpack "Redstonality v${packVersion} for ${version} via ${loader}.mrpack"`;
		await $`mv *.mrpack ../../out/`;
		cd("../..");
		bar.increment();
	}
}
bar.stop();
