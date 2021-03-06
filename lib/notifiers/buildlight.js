var _BuildLight = require('buildlight');

/**
 * class BuildLight
 *
 * @param {String} opts: optional
 * - scheme: color scheme array, defaults to [ 'red', 'green', 'blue' ]
 *           scheme allows flexibility to use BuildLight with various Delcom devices (RGB, RGY)
 * - usbled: path to usbled installation, if not specified then it will try to
 *           find a usbled installation at /sys/bus/usb/drivers/usbled/
 */
function BuildLight(opts) {
  opts = opts || {};
  this.buildLight = new _BuildLight(opts);
}

/**
 * Notify build status as a colour on Delcom USB Visual Indocator build light.
 *
 * @param {String} status: build status
 */
BuildLight.prototype.notify = function (status) {
  const COLOURS = {
      OK: 'green',
      FAIL: 'red',
      WARN: 'on' // all colours switched on is closer to yellow
    },
    UNKNOWN = 'blue';

  var colour = COLOURS[status],
    self = this;

  function _colourise() {
    if (status === 'FAIL') {
      self.buildLight.blink(colour, function (err) {
        if (err) {
          console.error(err.message);
        }
      });
    } else {
      self.buildLight[colour || UNKNOWN]();
    }
  }

  this.buildLight.unblink(_colourise);
};

module.exports = BuildLight;
