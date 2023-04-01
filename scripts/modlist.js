export async function getModlist() {
	const rawModlist = await $`cat modlist.json`.quiet();
	const modlist = JSON.parse(rawModlist.stdout);
	const modlistFunctions = [];
	// For each key in modlist["mods"],
	for (const mod of modlist.mods) {
		switch (mod.type) {
			case "modrinth":
				modlistFunctions.push({
					install: () => {
						return $`packwiz modrinth install ${mod.name} -y`;
					},
					type: mod.type,
					name: mod.name,
				});
				break;
			case "curseforge":
				modlistFunctions.push({
					install: () => {
						return $`packwiz curseforge install ${mod.name} -y`;
					},
					type: mod.type,
					name: mod.name,
				});
				break;
			case "url":
				modlistFunctions.push({
					install: () => {
						return $`packwiz url install ${mod.name} ${
							mod.url
						} --meta-folder=${`${mod.meta}s`}-y`;
					},
					type: `${mod.type}/${mod.meta}`,
					name: mod.name,
				});
				break;
			default:
				throw new Error(
					`Invalid mod type: ${mod.type}. Valid types are: modrinth, curseforge, url.`,
				);
		}
	}

	return modlistFunctions;
}
