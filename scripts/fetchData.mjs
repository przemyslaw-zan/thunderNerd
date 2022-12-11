import GithubFetcher from './GithubFetcher.mjs';

const githubFetcher = new GithubFetcher( 'gszabi99/War-Thunder-Datamine' );

const torpedoes = await githubFetcher.getBlkxFilesFromDirectory( 'aces.vromfs.bin_u/gamedata/weapons/torpedoes' );
const shop = await githubFetcher.getBlkxFileContent( 'char.vromfs.bin_u/config/shop.blkx' );

console.log( torpedoes );
console.log( shop );
