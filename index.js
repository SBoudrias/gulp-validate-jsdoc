'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var chalk = require('chalk');
var validateJsDoc = require('./validate-jsdoc');

module.exports = function (options) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-validate-jsdoc', 'Streaming not supported'));
			return cb();
		}

		try {
			validateJsDoc(file.contents);
		} catch (err) {
			err.message = chalk.red('Error: ') + path.relative(process.cwd(), file.path).replace(/\\/g, '/') +
			':\n' + err.message;
			this.emit('error', new gutil.PluginError('gulp-validate-jsdoc', err));
		}

		this.push(file);
		cb();
	});
};
