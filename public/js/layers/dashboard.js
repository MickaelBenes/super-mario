export function createDashboardLayer( font ) {
	return function drawDashboard( context ) {
		font.print( 'MARIO', context, 16, 8 );
	}
}