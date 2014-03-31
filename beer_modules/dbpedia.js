// Imports.
var fs = require('fs');
var request = require('request');
var moment = require('moment');

var doRequest = function(callback) {
  var date = moment();
  var month = date.format('MM');
  var day = date.format('DD');
  var files = [];
  fs.readdirSync('./beer_modules/dbpedia_queries').forEach(function(file) {
    files.push(file);
  });
  // Use a random one of these files.
  var file = './beer_modules/dbpedia_queries/' + files[Math.floor(Math.random() * files.length)];
  var query = encodeURIComponent(fs.readFileSync(file).toString());
  query = query.replace(/REPLACEDATE/g, month + '-' + day);
  var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&format=json&timeout=30000'
  console.log(url);
  request.get(url, function(err, res, body) {
    if (err) {
      callback(err);
      return;
    }
    var persons = JSON.parse(body);
    var random = Math.floor(Math.random() * persons.results.bindings.length);
    var person = persons.results.bindings[random];
    var year = person.date.value.replace('-' + month + '-' + day, '');
    var text = '<a href="' + person.wiki.value + '">' + person.name.value +
    '</a> was released on this day in ' + year + ". Let's drink to that! <br /><br />" +
    person.abstract.value;
    person.pic.value = person.pic.value.replace('/commons/', '/en/');
    text = text + '<br /><img src="' + person.pic.value + '">';
    callback(err, text);
  });
}

module.exports = doRequest;
