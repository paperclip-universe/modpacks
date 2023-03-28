#!/usr/bin/env zx
import { SingleBar, Presets } from "cli-progress";
import { versions } from "./versions.js";

const bar = new SingleBar(
	{
		format: " {bar} | {value}/{total} | {version} | ETA: {eta}s",
		version: "Starting...",
	},
	Presets.shades_classic,
);

$.verbose = false;
let packVersion = await $`cat .version`.quiet();
await $`mkdir -p out/`;
bar.start(versions.length, 0);
for (const folder of versions) {
	bar.update({ version: folder });
	cd(`quilt/${folder}`);
	await $`rm -rf *.mrpack`;
	await $`packwiz modrinth export -y`;
	await $`mv *.mrpack "Redstonality v${packVersion} for ${folder}.mrpack"`;
	await $`mv *.mrpack ../../out/`;
	cd("../..");
	bar.increment();
}
bar.stop();
