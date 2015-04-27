var gulp = require('gulp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var minifyCss = require('gulp-minify-css');

var jsFiles = ['webroot/modules/**/services.js', 'webroot/modules/**/controllers.js','webroot/js/third-party/*.js', 'webroot/js/app.js'];
var cssFiles = ['webroot/css/*.css'];

gulp.task('js', function () {
  gulp.src(jsFiles)
//    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
//    .pipe(ngAnnotate())
    .pipe(uglify())
//    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'))
});

gulp.task('css', function() {
  return gulp.src(cssFiles)
//    .pipe(sourcemaps.init())
    .pipe(concat('app.css'))
    .pipe(minifyCss({keepSpecialComments: 0}))
//    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'));
});

gulp.task('watch', ['js', 'css'], function () {
  gulp.watch(jsFiles, ['js']);
  gulp.watch(cssFiles, ['css']);
});
