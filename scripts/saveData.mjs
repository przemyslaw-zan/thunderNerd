import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const dataDirectoryPath = path.join( __dirname, '..', 'data' );

export default function saveData( filename, data ) {
	const filePath = path.join( dataDirectoryPath, `${ filename }.json` );
	const fileContent = JSON.stringify( data, null, '\t' ) + '\n';

	if ( !fs.existsSync( dataDirectoryPath ) ) {
		fs.mkdirSync( dataDirectoryPath );
	}

	fs.writeFileSync( filePath, fileContent );
}
