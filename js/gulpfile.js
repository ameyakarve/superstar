var gulp = require('gulp'),
	browserify = require('gulp-browserify'),
	sweeten = require("gulp-sweetjs");

gulp.task('default', function() {
	gulp.src('./actors/*.js')
		.pipe(sweeten({
			modules: ['./macros/actor-tell.js']
		}))
		.pipe(gulp.dest('./generated/'));
	console.log("Done!");
	gulp.src("./app.js")
		.pipe(browserify())
		.pipe(gulp.dest('./../generated/'));
})