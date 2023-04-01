#!/usr/bin/env zx
import { SingleBar, Presets } from "cli-progress";
import { versions, loaders } from "./consts.js";
import { getModlist } from "./modlist.js";

$.verbose = false;

// Get full modlist from fullModList.txt
const modlist = await getModlist();
const bar = new SingleBar(
	{
		format:
			" {bar} | {value}/{total} ({valid}) | {modname} | {version} | {loader} | {lastStatus} | ETA: {eta}s",
	},
	Presets.shades_classic,
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
		for (let i = 0; i < modlist.length; i++) {
			const mod = modlist[i];
			bar.update({ modname: mod.name, loader, version });
			try {
				await mod.install().quiet();
				bar.update({ valid: (valid += 1) });
			} catch (e) {
				if (
					e._combined.includes("no valid versions found") |
					e._combined.includes(
						"mod not available for the configured Minecraft version",
					)
				) {
					bar.update({ lastStatus: "No valid versions found" });
				} else if (e._combined.includes("429")) {
					bar.update({ lastStatus: "Rate limited" });
					await sleep(60000);
					i--;
				} else {
					console.log(e);
				}
			}
			bar.update(i);
		}
		await sleep(1000);
		cd("../..");
	}
}

bar.stop();
