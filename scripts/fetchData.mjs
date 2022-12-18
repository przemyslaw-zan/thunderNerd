import fetchObtainableVehicles from './fetchObtainableVehicles.mjs';
import fetchWeapons from './fetchWeapons.mjs';
import GithubFetcher from './GithubFetcher.mjs';
import saveData from './saveData.mjs';
import Stopwatch from './Stopwatch.mjs';

const stopwatch = new Stopwatch();
stopwatch.start();

const githubFetcher = new GithubFetcher( 'gszabi99/War-Thunder-Datamine' );

const obtainableVehicles = await fetchObtainableVehicles( githubFetcher, [ 'aviation', 'helicopters', 'ships', 'boats' ] );
const weapons = await fetchWeapons( githubFetcher, obtainableVehicles );

stopwatch.stop();

saveData( 'vehicles', obtainableVehicles );
saveData( 'weapons', weapons );
