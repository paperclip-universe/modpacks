#!/usr/bin/env zx
import { SingleBar, Presets } from "cli-progress";

// const bar = new SingleBar(
// 	{
// 		format: " {bar} | {value}/{total} | {version} | ETA: {eta}s",
// 		version: "Starting...",
// 	},
// 	Presets.shades_classic,
// );

let packVersion = await $`cat .version`.quiet();
const versions = await fs.readdir("quilt/");
await $`mkdir -p out/`;
// bar.start(versions.length, 0);
for (const folder of versions) {
	if (folder === ".DS_Store") continue; // Macos moment
	// bar.update({ version: folder });
	cd(`quilt/${folder}`);
	await $`rm -rf *.mrpack`;
	await $`packwiz modrinth export -y`;
	await $`mv *.mrpack "Redstonality v${packVersion} for ${folder}.mrpack"`;
	await $`mv *.mrpack ../../out/`;
	cd("../..");
	// bar.increment();
}
