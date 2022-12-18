export default async function getExplosiveTypeRatios( githubFetcher ) {
	const explosives = await githubFetcher.getBlkxFileContent( 'aces.vromfs.bin_u/gamedata/damage_model/explosive.blkx' );
	const explosiveTypes = Object.keys( explosives.explosiveTypes ).sort();
	const explosiveTypeRatios = {};

	for ( const explosiveType of explosiveTypes ) {
		explosiveTypeRatios[ explosiveType ] = explosives.explosiveTypes[ explosiveType ].strengthEquivalent;
	}

	return explosiveTypeRatios;
}
