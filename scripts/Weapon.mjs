export default class Weapon {
	constructor( weaponBlkPath ) {
		const match = weaponBlkPath.match(
			/aces\.vromfs\.bin_u\/gameData\/Weapons\/((?<category>[A-Za-z)]+)\/)?(?<weaponKey>.+)(\.blk)?$/i
		);

		if ( !match ) {
			console.log( weaponBlkPath );
		}

		this.weaponKey = match.groups.weaponKey;
		this.category = match.groups.category;
		this.filePath = match[ 0 ];
	}

	async fetchRepoData( githubFetcher, explosiveTypeRatios ) {
		// TODO: this is temporary.
		if ( this.category !== 'torpedoes' ) {
			return;
		}

		const data = await githubFetcher.getBlkxFileContent( this.filePath );

		this.explosiveTntEquivalent = data.torpedo.explosiveMass * explosiveTypeRatios[ data.torpedo.explosiveType ];
		this.range = data.torpedo.distToLive;
		this.speedMps = data.torpedo.maxSpeedInWater;
	}
}
