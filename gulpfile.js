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
    uglify = require('gulp-uglify-es').default;

const distributable = '' + 'dist' + '/',
    imagesDist = distributable + 'images',
    scriptsDist = distributable + 'scripts',
    cssDist = distributable + 'css';

const root = './' + 'src' + '/',
    htmlSRC = root + '*.html',
    imgSRC = root + 'images/**/*',
    jsSRC = root + 'js/**/*.js',
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

// Combine All Minify JS files
// function scripts() {
//     return gulp
//         .src(`${jsSRC}`)
//         .pipe(plumber())
//         .pipe(concat('main.js'))
//         .pipe(uglify())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(`${scriptsDist}`))
//         .pipe(browsersync.stream());
// }

function scripts() {
    return tsProject
        .src()
        // './src/ts/**/*.ts'
        .pipe(tsProject())
        // .pipe(plumber())
        // .pipe(concat('main.ts'))
        // .pipe(uglify())
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(`${scriptsDist}`))
        // .pipe(browsersync.stream());
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
    gulp.watch(`${jsSRC}`, scripts);
    gulp.watch(`${scssSRC}`, scss);
}

const build = gulp.series(clean, gulp.parallel(html, images, scss, scripts));
const watch = gulp.parallel(watchFiles, browserSync);

exports.build = build;
exports.watch = watch;
exports.default = gulp.series(build, watch);
