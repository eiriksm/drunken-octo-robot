var fs = require('fs');

fs.readdirSync('./beer_modules').forEach(function(file) {
  // If we find index.js, don't export.
  if (file === 'index.js') {
    return;
  }
  if (file.indexOf('.js') < 0) {
    return;
  }
  var exportname = file.replace('.js', '');
  exports[exportname] = require('./' + file);
});
