import GithubFetcher from './GithubFetcher.mjs';
import getObtainableVehicles from './getObtainableVehicles.mjs';

const githubFetcher = new GithubFetcher( 'gszabi99/War-Thunder-Datamine' );

// const torpedoes = await githubFetcher.getBlkxFilesFromDirectory( 'aces.vromfs.bin_u/gamedata/weapons/torpedoes' );

const obtainableVessels = await getObtainableVehicles( githubFetcher, [ 'ships', 'boats' ] );

console.log( obtainableVessels );
