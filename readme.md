# [gulp](http://gulpjs.com)-validate-jsdoc [![Build Status](https://travis-ci.org/SBoudrias/gulp-validate-jsdoc.svg?branch=master)](https://travis-ci.org/SBoudrias/gulp-validate-jsdoc)

> Ensure your JsDoc covers every functions parameters.


## Install

```bash
$ npm install --save-dev gulp-validate-jsdoc
```

## Usage

Just add the `validateJsDoc()` in the pipe. No options, no nothing.

```js
var gulp = require('gulp');
var validateJsDoc = require('gulp-validate-jsdoc');

gulp.task('default', function () {
    return gulp.src('src/app.js')
        .pipe(validateJsDoc())
        .pipe(gulp.dest('dist'));
});
```

## License

MIT © [Simon Boudrias](https://github.com/SBoudrias)
