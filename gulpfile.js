'use strict';

const gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    lec = require('gulp-line-ending-corrector'),
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    watchify = require("watchify"),
    tsify = require("tsify"),
    fancy_log = require("fancy-log"),
    uglify = require('gulp-uglify-es').default;

const distributable = '' + 'dist' + '/',
    imagesDist = distributable + 'images',
    scriptsDist = distributable + 'scripts',
    cssDist = distributable + 'css';

const root = './' + 'src' + '/',
    htmlSRC = root + '*.html',
    imgSRC = root + 'images/**/*',
    tsSRC = root + 'typescript/**/*.ts',
    scssSRC = root + 'scss/**/*.scss';

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: { baseDir: `${distributable}` },
        port: 3000,
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean() {
    return del([`${distributable}`]);
}

// Copy All HTML files
function html() {
    return gulp.src(`${htmlSRC}`).pipe(gulp.dest(`${distributable}`));
}

// Optimise Images
function images() {
    return gulp
        .src(`${imgSRC}`)
        .pipe(newer(`${imagesDist}`))
        .pipe(imagemin())
        .pipe(gulp.dest(`${imagesDist}`));
}

// Combine All Minify TS files
const watchedBrowserify = watchify(
    browserify({
        basedir: ".",
        debug: true,
        entries: ["src/typescript/main.ts"],
        cache: {},
        packageCache: {},
    }).plugin(tsify)
);

function scripts() {
    return watchedBrowserify
        .bundle()
        .on("error", fancy_log)
        // .pipe(plumber())
        .pipe(source("bundle.js"))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        .pipe(gulp.dest(`${scriptsDist}`))
        .pipe(browsersync.stream());
}

// Compile Scss
async function scss() {
    return gulp
        .src(`${scssSRC}`)
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(lec())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${cssDist}`))
        .pipe(browsersync.stream());
}

// Watch Files
function watchFiles() {
    gulp.watch(`${htmlSRC}`, gulp.series(html, browserSyncReload));
    gulp.watch(`${imgSRC}`, images);
    gulp.watch(`${tsSRC}`, scripts);
    gulp.watch(`${scssSRC}`, scss);
}

const build = gulp.series(clean, gulp.parallel(html, images, scss, scripts));
const watch = gulp.parallel(watchFiles, browserSync);
watchedBrowserify.on("update", scripts);
watchedBrowserify.on("log", fancy_log);

exports.build = build;
exports.watch = watch;
exports.default = gulp.series(build, watch);
