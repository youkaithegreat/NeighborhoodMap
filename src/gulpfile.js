/**
 * Created by Kevin on 2/7/2016.
 */
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('format-js', function() {
    gulp.src('./src/js/main.js')
        .pipe(prettify({indentSize: 4}))
        .pipe(gulp.dest('./src/js/main.js'))
});

gulp.task('prettify-html', function() {
    gulp.src('./src/index.html')
        .pipe(prettify({indentSize: 4}))
        .pipe(gulp.dest('./src/index.html'))
});

gulp.task('prettify-css', function() {
    gulp.src('./src/css/style.css')
        .pipe(prettify({indentSize: 4}))
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('default', function() {
    gulp.start('format-js', 'prettify-html', 'prettify-css');
});