export default async function getVehicleName( vehicleKey ) {
	const wikiUrl = 'https://wiki.warthunder.com/unit:' + vehicleKey;
	const response = await fetch( wikiUrl );
	const rawHTML = await response.text();

	const fullName = rawHTML.match( /(?<=The <b>).*?(?=<\/b>)/ )?.[ 0 ];
	const shortName = rawHTML.match( /(?<=<div class="general_info_name">).*?(?=<\/div>)/ )?.[ 0 ];

	return { shortName, fullName };
}
