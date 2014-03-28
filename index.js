var fs = require('fs');
var request = require('request');
var moment = require('moment');

var date = moment();
var month = date.format('MM');
var day = date.format('DD');
var file = ''; // TODO! Read from config.
var query = encodeURIComponent(fs.readFileSync(file).toString());
query = query.replace(/REPLACEDATE/g, month + '-' + day);
var url = 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + query + '&format=json&timeout=30000'

request.get(url, function(err, res, body) {
  var persons = JSON.parse(body);
  var random = Math.floor(Math.random() * persons.results.bindings.length);
  var person = persons.results.bindings[random];
  var year = person.date.value.replace('-' + month + '-' + day, '');
  var text = '<a href="' + person.wiki.value + '">' + person.name.value +
  '</a> was released on this day in ' + year + ". Let's drink to that! <br /><br />" +
  person.abstract.value;
  person.pic.value = person.pic.value.replace('/commons/', '/en/');
  text = text + '<br /><img src="' + person.pic.value + '">';
  var form = {
    form: {
      room_id: 0,// Make config
      from: 'Beer alert',
      message: text,
      message_format: 'html',
      auth_token: 0, // TODO! fix config.
      notify: 1
    }
  };
  request.post('http://api.hipchat.com/v1/rooms/message', form, function (e, r, body) {
  });

});

