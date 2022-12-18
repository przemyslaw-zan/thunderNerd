export default class GithubFetcher {
	constructor( repository ) {
		this.repository = repository;
	}

	async getBlkxFileContent( filePath ) {
		const base = `https://raw.githubusercontent.com/${ this.repository }/master/`;
		const fullPath = base + filePath.replace( /\.blk$/, '.blkx' ).toLowerCase();
		const response = await fetch( fullPath );
		const responseContent = await response.text();

		if ( responseContent.includes( '404: Not Found' ) ) {
			throw new Error( `This file does not exist:\n${ fullPath }` );
		}

		return JSON.parse( responseContent );
	}

	async getBlkxFilesFromDirectory( directoryPath ) {
		const base = `https://github.com/${ this.repository }/tree/master/`;
		const response = await fetch( base + directoryPath );
		const rawHTML = await response.text();
		return rawHTML.match( /(?<=title=").*?\.blkx(?=")/g );
	}
}
