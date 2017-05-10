var SerialPort = require('serialport');
var rp = require('request');
const ENV = require('./env.js');

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
    for (let id of ENV.IDS) {
      if (cache === id) {
        rp.post({url: `${ENV.LOCK_SERVER}/switch`}, function(err, res, body){
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
