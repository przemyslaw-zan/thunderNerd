import chalk from 'chalk';

import getObtainableVehicles from './getObtainableVehicles.mjs';
import GithubFetcher from './GithubFetcher.mjs';
import iterateWithCounter from './iterateWithCounter.mjs';
import removeDuplicateItems from './removeDuplicateItems.mjs';
import saveData from './saveData.mjs';

const startTime = Date.now();

const githubFetcher = new GithubFetcher( 'gszabi99/War-Thunder-Datamine' );

const obtainableVehicles = await getObtainableVehicles( githubFetcher, [ 'aviation', 'helicopters', 'ships', 'boats' ] );

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

const weaponPresets = {};

console.log( chalk.blue( 'Fetching weapon presets data...' ) );

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

obtainableVehicles.filter( vehicle => !vehicle.customPresets )
	.forEach( vehicle => vehicle.loadSecondaryWeapons( weaponPresets ) );

saveData( 'vehicles', obtainableVehicles );

// const weapons = removeDuplicateItems(
// 	obtainableVehicles.flatMap( vehicle => vehicle.secondaryWeapons )
// );

// console.log( weapons );

const endTime = Date.now();

const seconds = Math.floor( ( endTime - startTime ) / 1000 );
const secondsPart = seconds % 60;
const minutes = Math.floor( seconds / 60 );
const minutesPart = minutes % 60;
const hoursPart = Math.floor( minutes / 60 );

console.log( chalk.yellow( `Time spent: ${ hoursPart }:${ minutesPart }:${ secondsPart }` ) );
