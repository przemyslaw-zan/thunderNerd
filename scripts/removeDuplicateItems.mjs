export default function removeDuplicateItems( array ) {
	return [ ...new Set( array ) ];
}
