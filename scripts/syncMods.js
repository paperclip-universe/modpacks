#!/usr/bin/env zx
import { SingleBar, Presets } from "cli-progress";
import { versions, loaders } from "./consts.js";

$.verbose = false;

// Get full modlist from fullModList.txt
let modlist = await $`cat fullModList.txt`;
modlist = modlist.stdout
	.split("\n")
	.filter((x) => x.length > 0 && !x.startsWith("#"))
	.map((mod) => mod.split("/"));
const bar = new SingleBar(
	{
		format: " {bar} | {value}/{total} ({valid}) | {modname} | {version} | {loader} | {lastStatus} | ETA: {eta}s",
	},
	Presets.shades_classic
);

bar.start(loaders.length * versions.length * modlist.length, 0, {
	modname: `${modlist[0][0]}/${modlist[0][1]}`,
	loader: "Starting...",
	version: versions[0],
	lastStatus: "OK",
	valid: 0,
});

for (const version of versions) {
	for (const loader of loaders) {
		cd(`${loader}/${version}`);
		let valid = 0;
		for (const mod of modlist) {
			bar.update({ modname: `${mod[0]}/${mod[1]}`, loader, version });
			await $`packwiz ${mod[0]} install ${mod[1]} -y`
				.quiet()
				.then(() => bar.update({ valid: (valid += 1) }))
				.catch(async (e) => {
					if (
						e.stdout.includes("no valid versions found") |
						e.stdout.includes(
							"mod not available for the configured Minecraft version"
						)
					) {
						bar.update({ lastStatus: "No valid versions found" });
					} else if (e.stdout.includes("429")) {
						bar.update({ lastStatus: "Rate limited" });
						await sleep(60000);
						return await $`packwiz ${mod[0]} install ${mod[1]} -y`.catch(
							(_) => {}
						);
					} else {
						console.log(e);
					}
				});
			bar.increment();
		}
		await sleep(1000);
		cd("../..");
	}
}

bar.stop();
