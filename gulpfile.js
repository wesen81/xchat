var path    = require('path');
var gulp    = require('gulp');
var compass = require('gulp-compass');
var concat  = require('gulp-concat');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var server  = require('gulp-server-livereload');

var libs = [
	// Libs
	"jquery-3.3.1.min"
];

var source = [
	// Components
	"Base",
	"TabManager",
	"Tab",
	"Socket",
	"SwipeEvent",
	"Slider",

	// Boards
	"ChatBoard",
	"CarouselBoard",
	"SettingsBoard",

	// Application
	"App",
	"Docler"

];

var dist = 'dist';
var resources = dist + '/resources';
var fonts = resources + '/fonts';
var images = resources + '/images';

// watch css
// build-css
// build-js


gulp.task('build-js', function() {

	var files = [];

	libs.forEach(function(file) {
		files.push('src/lib/' + file + '.js');
	});

	source.forEach(function(file) {
		files.push('src/js/' + file + '.js');
	});

	return gulp.src(files)
			   .pipe(concat('docler.js'))
			   .pipe(rename('docler.min.js'))
			   .pipe(uglify())
			   .pipe(gulp.dest(resources));

});

gulp.task('build-css', function() {
	gulp.src('./src/*.scss')
		.pipe(compass({
			css: resources,
			font: fonts,
			image: images,
			sass: 'src/scss',
			style: 'compressed',
			environment: 'production',
			comments: false
		}))
		.pipe(gulp.dest(resources));
});

gulp.task('build-html', function() {
	return gulp.src(['./src/*.html'])
			   .pipe(htmlmin({
				   collapseWhitespace: true,
				   removeComments: true
			   }))
			   .pipe(gulp.dest(dist));
});

gulp.task('watch', ['build'], function() {
	gulp.watch('src/scss/**/*.scss', ['build-css']);
	gulp.watch('src/js/**/*.js', ['build-js']);
	gulp.watch('src/*html', ['build-html']);
});

gulp.task('copy', function () {
	gulp.src('node_modules/font-awesome/fonts/*')
		.pipe(gulp.dest(fonts));

	gulp.src('src/images/**/*')
		.pipe(gulp.dest(images));
});

gulp.task('build', [
	'copy',
	'build-js',
	'build-css',
	'build-html'
]);

gulp.task('dist-server', ['build'], function() {
	gulp.src(dist)
		.pipe(server({
			port: 9001,
			open: true
		}));
});

gulp.task('dev-server', ['watch'], function() {
	gulp.src(dist)
		.pipe(server({
			port: 9002,
			livereload: true,
			open: true
		}));
});