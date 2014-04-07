// Imports.
var fs = require('fs');
var request = require('request');
var moment = require('moment');
var util = require('util');

var verbs = {
  'movies.txt': 'was released',
  'deaths.txt': 'died',
  'discovered.txt': 'was discovered'
};

// Obviously we need to keep a tab on which file needs "commons" replaced in
// the image src. :(
var noReplace = {
  'discovered.txt': true
};

var doRequest = function(callback) {
  var date = moment();
  var month = date.format('MM');
  var day = date.format('DD');
  var files = [];
  fs.readdirSync('./beer_modules/dbpedia_queries').forEach(function(file) {
    files.push(file);
  });
  // Use a random one of these files.
  var filename = files[Math.floor(Math.random() * files.length)];
  var file = './beer_modules/dbpedia_queries/' + filename;
  var query = encodeURIComponent(fs.readFileSync(file).toString());
  // Magic keyword: REPLACEDATE
  query = query.replace(/REPLACEDATE/g, month + '-' + day);
  var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&format=json&timeout=30000';
  request.get(url, function(err, res, body) {
    if (err) {
      callback(err);
      return;
    }
    try {
      var wikis = JSON.parse(body);
      // If we have no sign of interesting data. Throw error.
      if (!wikis || !wikis.results || !wikis.results.bindings || !wikis.results.bindings[0]) {
        throw new Error('No results found');
      }
      var random = Math.floor(Math.random() * wikis.results.bindings.length);
      var wiki = wikis.results.bindings[random];
      var year = wiki.date.value.replace('-' + month + '-' + day, '');
      // Image is not valid unless we hack it a little. Some times that is :(
      if (!noReplace[filename]) {
        wiki.pic.value = wiki.pic.value.replace('/commons/', '/en/');
      }
      var text = util.format('<a href="%s">%s</a> %s on this day in %s. Lets drink to that! <br /><br />%s<br /><img src="%s" />',
        wiki.wiki.value,
        wiki.name.value,
        verbs[filename],
        year,
        wiki.abstract.value,
        wiki.pic.value
      );
      callback(err, text);
    }
    catch(error) {
      callback(error);
    }
  });
};

module.exports = doRequest;
