import removeDuplicateItems from './removeDuplicateItems.mjs';

export default class Vehicle {
	constructor( vehicleKey, type, country ) {
		this.vehicleKey = vehicleKey;
		this.shortName = undefined;
		this.fullName = undefined;
		this.type = type;
		this.country = country;
		this.customPresets = undefined;
		this.secondaryWeapons = [];
	}

	async fetchWikiData() {
		const wikiUrl = `https://wiki.warthunder.com/unit:${ this.vehicleKey }`;
		const response = await fetch( wikiUrl );
		const rawHTML = await response.text();

		this.fullName = rawHTML.match( /(?<=The <b>).*?(?=<\/b>)/ )?.[ 0 ];
		this.shortName = rawHTML.match( /(?<=<div class="general_info_name">).*?(?=<\/div>)/ )?.[ 0 ];
	}

	async fetchRepoData( githubFetcher ) {
		const repoMap = {
			army: 'units/tankmodels',
			ships: 'units/ships',
			boats: 'units/ships',
			aviation: 'flightmodels',
			helicopters: 'flightmodels'
		};

		const repoUrl = `aces.vromfs.bin_u/gamedata/${ repoMap[ this.type ] }/${ this.vehicleKey }.blkx`;
		const data = await githubFetcher.getBlkxFileContent( repoUrl );

		// TODO: this is temporary.
		if ( data.modifications.torpedoes_movement_mode ) {
			const { distToLive, maxSpeedInWater } = data.modifications.torpedoes_movement_mode.effects;

			this.modifications = {
				torpedoMode: {
					speedMps: maxSpeedInWater,
					range: distToLive
				}
			};
		}

		if ( !( data.weapon_presets.preset instanceof Array ) ) {
			data.weapon_presets.preset = [ data.weapon_presets.preset ];
		}

		if ( !data.WeaponSlots ) {
			this.customPresets = false;

			this.weaponPresets = data.weapon_presets.preset
				.filter( preset => preset.tags ? !preset.tags.aux : true )
				.map( preset => 'aces.vromfs.bin_u/' + preset.blk );

			return;
		}

		this.customPresets = true;

		data.WeaponSlots.WeaponSlot.forEach( weaponSlot => {
			if ( !weaponSlot.WeaponPreset ) {
				return;
			}

			if ( !( weaponSlot.WeaponPreset instanceof Array ) ) {
				weaponSlot.WeaponPreset = [ weaponSlot.WeaponPreset ];
			}

			weaponSlot.WeaponPreset.forEach( weaponPreset => {
				if ( !weaponPreset.iconType || !weaponPreset.Weapon ) {
					return;
				}

				if ( !( weaponPreset.Weapon instanceof Array ) ) {
					weaponPreset.Weapon = [ weaponPreset.Weapon ];
				}

				weaponPreset.Weapon.forEach( weapon => {
					this.secondaryWeapons.push( 'aces.vromfs.bin_u/' + weapon.blk );
				} );
			} );
		} );

		this.secondaryWeapons = removeDuplicateItems( this.secondaryWeapons ).sort();
	}

	loadSecondaryWeapons( weaponPresets ) {
		for ( const weaponPreset of this.weaponPresets ) {
			if ( !weaponPresets[ weaponPreset ] ) {
				continue;
			}

			this.secondaryWeapons.push( ...weaponPresets[ weaponPreset ] );
		}

		this.secondaryWeapons = removeDuplicateItems( this.secondaryWeapons ).sort();

		delete this.weaponPresets;
	}
}
