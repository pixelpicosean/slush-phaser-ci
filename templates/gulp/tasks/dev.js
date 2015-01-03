var browserSync  = require('browser-sync');
var handleErrors = require('../util/handleErrors');


module.exports = function (gulp, $, config) {

    var dirs  = config.dirs;
    var globs = config.globs;

    gulp.task('dev:build:views', function () {
        return gulp.src(globs['views'])
            .pipe(gulp.dest(dirs['temp']))
            .pipe(browserSync.reload({ stream: true }));
    });

    gulp.task('dev:build:styles', function () {
        return gulp.src(globs['styles'])
            .pipe(handleErrors())
            .pipe($.less())
            .pipe($.concat('style.css'))
            .pipe(gulp.dest(dirs['temp']))
            .pipe(browserSync.reload({ stream: true }));
    });

    gulp.task('dev:build:scripts', [ 'dev:lint' ], function () {
        return gulp.src(globs['scripts'])
            .pipe(handleErrors())
            .pipe($.sourcemaps.init())
            .pipe($.traceur({
                modules: 'register',
                moduleName: true
            }))
            .pipe($.concat('game.js'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(dirs['temp']))
            .pipe(browserSync.reload({ stream: true }));
    });

    gulp.task('dev:server', [ 'dev:build' ], function () {
        browserSync({
            server: {
                baseDir: [
                    dirs['static'],
                    dirs['temp']
                ]
            }
        });
    });

    gulp.task('dev:watch', function () {
        gulp.watch(globs['scripts'], [ 'dev:build:scripts' ]);
        gulp.watch(globs['styles'],  [  'dev:build:styles' ]);
        gulp.watch(globs['views'],   [   'dev:build:views' ]);
    });

    gulp.task('dev:lint', function () {
        return gulp.src([ globs['scripts'] ])
            .pipe(handleErrors())
            .pipe($.jshint('.jshintrc'))
            .pipe($.jshint.reporter('jshint-stylish'));
    });

    gulp.task('dev:build', [
        'dev:build:views',
        'dev:build:styles',
        'dev:build:scripts'
    ]);

    gulp.task('dev', [
        'dev:watch',
        'dev:server'
    ]);

    // Aliasing `dev` as default task.
    gulp.task('default', [ 'dev' ]);

};
