test:
	./node_modules/mocha/bin/mocha
	./node_modules/.bin/jshint lib/ beer_modules/

.PHONY: test
