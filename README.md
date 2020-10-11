# API package for Kiloview N40 NDI Encoder/decoder

## Installation

```bash
npm install kiloview-ndi # OR yarn add kiloview-ndi
```

Easily control the converters over their simple API. Remember to add a user to the device, and give it HTTP API access.

## Example

Usage example:

```js
const kiloviewNDI = require('kiloview-ndi');
const converter = new kiloviewNDI('10.0.0.10', 'admin', 'admin');

// Toggle between encoder/decoder
async function toggle() {
	let mode = await converter.modeGet();

	if (mode.mode === 'decoder') {
		await converter.modeSwitch('encoder');
	} else {
		await converter.modeSwitch('decoder');
	}
}

toggle();
```

## API methods currently implemented

* modeGet()
* modeSwitch(mode)
* modeStatus()
* decoderDiscoveryGet()
* decoderCurrentStatus()
* decoderCurrentSetPreset(id)
* decoderCurrentSetUrl(name, url)
* decoderPresetSetBlank(color)
* encoderNdiStatus()
* encoderNdiGetConfig()
* encoderNdiSetConfig(config)
* sysServerInfo()
* sysReconnect()
* sysReboot()
* sysRestore()