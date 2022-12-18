import chalk from 'chalk';

export default class Stopwatch {
	start() {
		console.log( chalk.yellow( 'Starting the stopwatch.' ) );

		this.startTime = Date.now();
	}

	stop() {
		const endTime = Date.now();

		const seconds = Math.floor( ( endTime - this.startTime ) / 1000 );
		const minutes = Math.floor( seconds / 60 );

		const secondsPart = addLeadingZero( seconds % 60 );
		const minutesPart = addLeadingZero( minutes % 60 );
		const hoursPart = addLeadingZero( Math.floor( minutes / 60 ) );

		console.log( chalk.yellow( 'Stopping the stopwatch.' ) );
		console.log( chalk.yellow( `Time spent: ${ hoursPart }:${ minutesPart }:${ secondsPart }` ) );
	}
}

function addLeadingZero( number ) {
	const string = String( number );

	if ( string.length < 2 ) {
		return '0' + string;
	}

	return string;
}
