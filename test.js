'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var gutil = require('gulp-util');
var chalk = require('chalk');
var validateJsdoc = require('./index');

var passFixture = path.resolve(__dirname, 'fixtures/pass.js');
var failFixture = path.resolve(__dirname, 'fixtures/fail.js');

it('pass when no errors are found', function (done) {
	var stream = validateJsdoc();

	stream.on('data', function (file) {
		assert.equal(file.path, passFixture);
	});
	stream.on('error', assert.bind(null, false));
	stream.on('end', done);

	stream.write(new gutil.File({
		base: __dirname,
		path: passFixture,
		contents: new Buffer(fs.readFileSync(passFixture, 'utf-8'))
	}));

	stream.end();
});

it('fails when errors are found', function (done) {
	var stream = validateJsdoc();

	stream.on('data', function () {});
	stream.on('error', function (err) {
		assert.equal(chalk.stripColor(err.message), 'Error: fixtures/fail.js:\nIn function Add (Line 8):\n  Parameter z is not documented.');
		done();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: failFixture,
		contents: new Buffer(fs.readFileSync(failFixture, 'utf-8'))
	}));

	stream.end();
});
