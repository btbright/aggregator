var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    assign = require('lodash').assign,
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    packageConfig = require('./package.json'),
    envify = require('envify/custom'),
    exec = require('child_process').exec;



gulp.task('default', ['styles','scripts'], function(){
    gulp.watch(packageConfig.paths.sass,['styles']);
    gulp.watch(packageConfig.paths.js,['scripts']);
    gulp.watch(packageConfig.paths.jsx,['scripts']);
});

gulp.task('styles', function() {
    gulp.src(packageConfig.paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({ cascade: true }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(packageConfig.dest.styles));

    gulp.src(packageConfig.paths.css)
        .pipe(gulp.dest(packageConfig.dest.styles));
});

gulp.task('scripts', function(done){
    bundleJS(done);
});

gulp.task('test', ['run-test'], function(){
    gulp.watch(packageConfig.paths.js,['run-test']);
    gulp.watch(packageConfig.paths.tests,['run-test']);
});

gulp.task('run-test', function(done){
    exec('npm test', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        done();
      });
});

var customOpts = {
  entries: [packageConfig.paths.app],
  transform: ['babelify','reactify','debowerify'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);

var b = watchify(browserify(opts)); 
b.transform(envify({
  NODE_ENV: 'production'
}))
b.on('update', bundleJS);
b.on('log', gutil.log);

function bundleJS(cb) {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(packageConfig.dest.app))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    //.pipe(uglify())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(packageConfig.dest.scripts))
    .on('end', cb);
}
