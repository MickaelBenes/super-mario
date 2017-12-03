export function createDashboardLayer( font, playerEnv ) {
	const line1 = font.size;
	const line2 = line1 * 2;
	const score = 24500;

	return function drawDashboard( context ) {
		const time	= playerEnv.playerController.time;

		font.print( 'MARIO', context, 16, line1 );
		font.print( score.toString().padStart( 6, '0' ), context, 16, line2 );
		font.print( 'WORLD', context, 152, line1 );
		font.print( 'TIME', context, 208, line1 );
		font.print( time.toFixed().toString().padStart( 3, '0' ), context, 216, line2 );
	}
}