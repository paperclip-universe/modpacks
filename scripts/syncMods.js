#!/usr/bin/env zx
import { SingleBar, Presets } from "cli-progress";

// Get full modlist from fullModList.txt
let modlist = await $`cat fullModList.txt`.quiet();
modlist = modlist.stdout
	.split("\n")
	.filter((x) => x.length > 0 && !x.startsWith("#"))
	.map((mod) => mod.split("/"));
echo("");
for (const folder of await fs.readdir("quilt/")) {
	cd(`quilt/${folder}`);
	const bar = new SingleBar(
		{
			modname: folder,
			format: " {bar} | {value}/{total} | {modname} | {version} | ETA: {eta}s",
		},
		Presets.shades_classic,
	);
	bar.start(modlist.length, 0, { modname: "Starting...", version: folder });
	for (const mod of modlist) {
		bar.update({ modname: `${mod[0]}/${mod[1]}` });
		await $`packwiz ${mod[0]} install ${mod[1]} -y`.quiet().catch((e) => {
			// Check if rate-limited
			if (e.stderr.includes("429")) {
				sleep(60000);
				return $`packwiz ${mod[0]} install ${mod[1]} -y`.catch((_) => {});
			} else {
				console.log(e);
			}
		});
		bar.increment();
	}
	bar.stop();
	await sleep(1000);
	cd("../..");
}
