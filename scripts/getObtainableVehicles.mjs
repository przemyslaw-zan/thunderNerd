import chalk from 'chalk';

import Vehicle from './Vehicle.mjs';

/**
 * Types: "army", "aviation", "helicopters", "ships", "boats".
 */
export default async function getObtainableVehicles( githubFetcher, types ) {
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
				.filter( vehicleKey => !vehicleKey.endsWith( '_race' ) )
				.map( vehicleKey => new Vehicle( vehicleKey, type, country ) );

			obtainableVehicles.push( ...vehicles );
		}
	}

	return obtainableVehicles;
}
