var moment = require('moment');
var beer_modules = require('./beer_modules');

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

bm(function(err, text) {
  console.log(err, text);
});
