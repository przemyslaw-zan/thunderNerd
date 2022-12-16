import getVehicleName from './getVehicleName.mjs';

/**
 * Types: "army", "aviation", "helicopters", "ships", "boats".
 */
export default async function getObtainableVehicles( githubFetcher, types ) {
	console.log( 'Fetching full list of vehicles...' );

	const techTrees = await githubFetcher.getBlkxFileContent( 'char.vromfs.bin_u/config/shop.blkx' );

	const obtainableVessels = {};
	let vehicleCount = 0;
	let processedVehicles = 0;

	for ( const countryGroup in techTrees ) {
		const countryName = countryGroup.replace( 'country_', '' );

		for ( const type of types ) {
			if ( !techTrees[ countryGroup ][ type ] ) {
				continue;
			}

			const vehicleNames = techTrees[ countryGroup ][ type ].range
				.flatMap( techTreeBranch => Object.keys( techTreeBranch ) )
				.filter( vehicleKey => !vehicleKey.endsWith( '_race' ) );

			obtainableVessels[ countryName ] ??= [];
			obtainableVessels[ countryName ].push( ...vehicleNames );
			vehicleCount += vehicleNames.length;
		}
	}

	console.log( 'Fetching vehicle names...' );
	console.log( `0 / ${ vehicleCount } (0.0 %)` );

	for ( const countryName in obtainableVessels ) {
		const vehicles = [];

		for ( const vehicleKey of obtainableVessels[ countryName ] ) {
			const vehicleName = await getVehicleName( vehicleKey );
			vehicles.push( { vehicleKey, ...vehicleName } );

			process.stdout.moveCursor( 0, -1 );
			process.stdout.clearLine( 1 );
			processedVehicles++;
			const processedPercent = ( processedVehicles / vehicleCount * 100 ).toFixed( 1 );
			console.log( `${ processedVehicles } / ${ vehicleCount } (${ processedPercent } %)` );
		}

		obtainableVessels[ countryName ] = vehicles;
	}

	return obtainableVessels;
}
