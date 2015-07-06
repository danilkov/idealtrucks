var gulp = require('gulp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var minifyCss = require('gulp-minify-css');

var jsFiles = [
	'webroot/js/third-party/angular-translate.js',
	'webroot/js/third-party/angular-translate-loader-partial.js',
	'webroot/js/third-party/loading-bar.js',
	'webroot/js/third-party/angular-polyglot.language.switcher.js',
	'webroot/modules/directives/*.js',
	'webroot/modules/**/services.js',
	'webroot/modules/**/controllers.js',
	'webroot/js/main.js'
];
var cssFiles = [
//	'webroot/css/base.css',
//	'webroot/css/cake.css',
	'webroot/css/loading-bar.css',
	'webroot/css/password-strength.css',
	'webroot/css/polyglot-language-switcher-2.css',
	'webroot/css/main.css'
];

gulp.task('js', function () {
  gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
//    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./webroot/js/'))
});

gulp.task('css', function() {
  gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('app.css'))
    .pipe(minifyCss({keepSpecialComments: 0}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./webroot/css/'));
});

gulp.task('dist', function () {
    gulp.src(jsFiles)
        .pipe(concat('app.js'))
  //      .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./webroot/js/'))

    gulp.src(cssFiles)
        .pipe(concat('app.css'))
        .pipe(minifyCss({keepSpecialComments: 0}))
        .pipe(gulp.dest('./webroot/css/'));
});

gulp.task('watch', ['js', 'css'], function () {
  gulp.watch(jsFiles, ['js']);
  gulp.watch(cssFiles, ['css']);
});
