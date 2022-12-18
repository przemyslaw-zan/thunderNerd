import chalk from 'chalk';

import removeDuplicateItems from './removeDuplicateItems.mjs';
import Vehicle from './Vehicle.mjs';
import iterateWithCounter from './iterateWithCounter.mjs';

/**
 * Types: "army", "aviation", "helicopters", "ships", "boats".
 */
export default async function fetchObtainableVehicles( githubFetcher, types ) {
	console.log( chalk.blue( 'Fetching full list of vehicles...' ) );

	const techTrees = await githubFetcher.getBlkxFileContent( 'char.vromfs.bin_u/config/shop.blkx' );

	const obtainableVehicles = [];

	for ( const countryGroup in techTrees ) {
		const country = countryGroup.replace( 'country_', '' );

		for ( const type of types ) {
			if ( !techTrees[ countryGroup ][ type ] ) {
				continue;
			}

			const vehicles = techTrees[ countryGroup ][ type ].range
				.map( techTreeBranch => {
					Object.keys( techTreeBranch )
						.filter( item => item.endsWith( '_group' ) )
						.forEach( groupName => {
							for ( const key in techTreeBranch[ groupName ] ) {
								if ( !( techTreeBranch[ groupName ][ key ] instanceof Object ) ) {
									delete techTreeBranch[ groupName ][ key ];
								}
							}

							techTreeBranch = Object.assign( techTreeBranch, techTreeBranch[ groupName ] );
							delete techTreeBranch[ groupName ];
						} );

					return techTreeBranch;
				} )
				.flatMap( techTreeBranch => Object.keys( techTreeBranch ) )
				.filter( vehicleKey => {
					if ( vehicleKey.endsWith( '_race' ) ) {
						return false;
					}

					if ( vehicleKey.startsWith( 'ucav_' ) ) {
						return false;
					}

					return true;
				} )
				.map( vehicleKey => new Vehicle( vehicleKey, type, country ) );

			obtainableVehicles.push( ...vehicles );
		}
	}

	// Reduction ratio for testing
	// obtainableVehicles = obtainableVehicles.filter( ( v, i ) => !( i % 50 ) );

	console.log( chalk.blue( 'Fetching vehicles data...' ) );

	await iterateWithCounter( obtainableVehicles, async vehicle => {
		await vehicle.fetchWikiData();
		await vehicle.fetchRepoData( githubFetcher );
	} );

	const weaponPresetUrls = removeDuplicateItems(
		obtainableVehicles
			.filter( vehicle => !vehicle.customPresets )
			.flatMap( vehicle => vehicle.weaponPresets )
	);

	console.log( chalk.blue( 'Fetching weapon presets data...' ) );

	const weaponPresets = {};

	await iterateWithCounter( weaponPresetUrls, async presetUrl => {
		const presetData = await githubFetcher.getBlkxFileContent( presetUrl );

		if ( !presetData.Weapon ) {
			return;
		}

		if ( !( presetData.Weapon instanceof Array ) ) {
			presetData.Weapon = [ presetData.Weapon ];
		}

		weaponPresets[ presetUrl ] = removeDuplicateItems(
			presetData.Weapon.map( weapon => weapon.blk ? 'aces.vromfs.bin_u/' + weapon.blk : weapon.preset )
		);
	} );

	obtainableVehicles
		.filter( vehicle => !vehicle.customPresets )
		.forEach( vehicle => vehicle.loadSecondaryWeapons( weaponPresets ) );

	return obtainableVehicles;
}
