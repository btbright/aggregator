var gulp = require('gulp'),
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
    rename = require('gulp-rename'),
    glob = require('glob'),
    path = require('path'),
    babelify = require('babelify'),
    es = require('event-stream');

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
    glob(packageConfig.paths.app, function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .transform(
                    babelify.configure({
                        // load the runtime to be able to use Object.assign
                        optional: ["runtime"]
                    })
                )
                .transform('reactify')
                .transform('debowerify')
                .bundle()
                .on('error', gutil.log.bind(gutil, 'Browserify Error'))
                .pipe(source(path.basename(entry)))
                .pipe(buffer())
                //.pipe(uglify())
                // optional, remove if you dont want sourcemaps
                .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
                   // Add transformation tasks to the pipeline here.
                .pipe(sourcemaps.write('./')) // writes .map file
                .pipe(gulp.dest(packageConfig.dest.scripts));
            });
        es.merge(tasks).on('end', done);
    })
});