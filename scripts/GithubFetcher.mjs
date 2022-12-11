export default class GithubFetcher {
	constructor( repository ) {
		this.repository = repository;
	}

	async getBlkxFileContent( filePath ) {
		const base = `https://raw.githubusercontent.com/${ this.repository }/master/`;
		const response = await fetch( base + filePath );
		return response.json();
	}

	async getBlkxFilesFromDirectory( directoryPath ) {
		const base = `https://github.com/${ this.repository }/tree/master/`;
		const response = await fetch( base + directoryPath );
		const rawHTML = await response.text();
		return rawHTML.match( /(?<=title=").*?\.blkx(?=")/g );
	}
}
