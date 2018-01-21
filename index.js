var SerialPort = require('serialport');
var rq = require('request');
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
  if (code === 40) {
    for (let keyholder of keyholders) {        
        var card = keyholder.cards[cache];
        if (card) {
            rq.post({
                url: `${ENV.LOCK_SERVER}/switch`,
                form: {
                    token: ENV.TOKEN,
                    message: formatMessage(keyholder, card)
                }
            }, function (err, res, body) {
                console.log(body);
            });
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
  console.log(card);
  let message = keyholder.name + ' (@' + keyholder.telegram + ') 用 '+ card;
  return message;
}
