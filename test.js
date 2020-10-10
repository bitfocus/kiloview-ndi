const kiloviewNDI = require('./index');

const converter = new kiloviewNDI('10.0.0.10', 'admin', 'admin');

async function main() {
	let mode = await converter.modeGet();

	if (mode.mode === 'decoder') {
		const lastConnection = await converter.decoderCurrentStatus();

		converter.decoderCurrentSetPreset(0);

		const time = setInterval(() => {
			let [ r, g, b ] = [ Math.random(255), Math.random(255), Math.random(255) ];
			converter.decoderPresetSetBlank('#' + ('0' + r.toString(16)).substr(-2) + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2))
				.catch((e) => {
					clearInterval(time);
					console.error(e);
				});
		}, 50);

		setTimeout(() => {
			clearInterval(time);

			converter.decoderCurrentSetUrl(lastConnection.name, lastConnection.url).catch((e) => {
				console.error(e);
			});
		}, 4000);
	} else {
		console.log("Converter in encode mode, wont test");
	}
}

main().catch((e) => console.error(e));