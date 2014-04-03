var beer_modules = require('../beer_modules');

var getModule = function() {
  var result;
  var count = 0;
  for (var prop in beer_modules) {
    if (beer_modules.hasOwnProperty(prop)) {
      if (Math.random() < 1/++count) {
        result = prop;
      }
    }
  }
  return beer_modules[result];
};

// Find a beer_module to use.
var bm = getModule();

var moduleCallback = function(err, text) {
  bm = getModule();
  if (err) {
    bm(moduleCallback);
    return;
  }
  // Do something with the results.
}

module.exports = function() {
  bm(moduleCallback);
}
