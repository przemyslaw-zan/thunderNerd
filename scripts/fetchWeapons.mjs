import chalk from 'chalk';

import getExplosiveTypeRatios from './getExplosiveTypeRatios.mjs';
import iterateWithCounter from './iterateWithCounter.mjs';
import removeDuplicateItems from './removeDuplicateItems.mjs';
import Weapon from './Weapon.mjs';

export default async function fetchWeapons( githubFetcher, obtainableVehicles ) {
	const weapons = removeDuplicateItems( obtainableVehicles.flatMap( vehicle => vehicle.secondaryWeapons ) )
		.map( weaponBlkPath => new Weapon( weaponBlkPath ) );

	const explosiveTypeRatios = await getExplosiveTypeRatios( githubFetcher );

	console.log( chalk.blue( 'Fetching weapons data...' ) );

	await iterateWithCounter( weapons, weapon => weapon.fetchRepoData( githubFetcher, explosiveTypeRatios ) );

	return weapons;
}
