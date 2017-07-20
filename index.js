var SerialPort = require('serialport');
var rp = require('request');
const ENV = require('./env.js');
const keyholders = require('./keyholders.js');

// set RFID reader
var reader = new SerialPort(ENV.SERIAL_PORT, {
  baudRate: 57600
});

// card number buffer
var cache = '';

reader.on('data', function(buf) {
  // get decimal keycode
  var code = buf.readUIntLE(2);

  // verify card number when 'enter'
  let stop = false;
  if (code === 40) {
    for (let keyholder of keyholders) {
        for (let card of keyholder.cards) {
            if (card.id === cache) {
                rp.post({
                    url: `${ENV.LOCK_SERVER}/switch`,
                    form: {
                        token: ENV.TOKEN,
			message: formatMessage(keyholder, card.title)
                    }
                }, function (err, res, body) {
                    console.log(body);
                });
                stop = true;
                break;
            }
        }
        if (stop) {
            break;
        }
    }

    // clear card number buffer
    cache = '';
  }	 

  // record card number (ignore 0 & enter)
  if (code !== 0 && code !== 40) {
    cache += (code-29) % 10;
  }
})

function formatMessage(keyholder, card) {
  console.log(keyholder.telegram);
  let message = `${keyholder.name} (@${keyholder.telegram}) 用 ${card}`;
  return message;
}
