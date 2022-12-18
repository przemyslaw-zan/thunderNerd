import chalk from 'chalk';

export default async function iterateWithCounter( array, callback ) {
	const total = array.length;
	let counter = 0;

	console.log( chalk.blue( `0 / ${ total } (0.0 %)` ) );

	for ( const item of array ) {
		await callback( item );

		process.stdout.moveCursor( 0, -1 );
		process.stdout.clearLine( 1 );
		counter++;
		const processedPercent = ( counter / total * 100 ).toFixed( 1 );
		console.log( chalk.blue( `${ counter } / ${ total } (${ processedPercent } %)` ) );
	}
}
