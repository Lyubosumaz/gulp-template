'use strict';

const browsersync = require('browser-sync').create();
const reload = browsersync.reload;
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const changed = require('gulp-changed');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const lineec = require('gulp-line-ending-correct');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;

async function message() {
    return console.log('Gulp is running...');
}

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './dist/',
        },
        port: 3000,
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Copy All HTML files
function html() {
    return gulp.src('src/*.html').pipe(gulp.dest('dist'));
}

// Optimise Images
function images() {
    return gulp.src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
}

// Combine All Minify JS files
function scripts() {
    return gulp.src('src/js/*.js').pipe(concat('main.js')).pipe(uglify()).pipe(gulp.dest('dist/scripts'));
}

// Compile Scss
function scss() {
    return gulp.src('src/scss/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('dist/css'));
}

// Watch Files
function watchFiles() {
    gulp.watch('src/*.html', gulp.series(html, browserSyncReload));
    gulp.watch('src/images/*', images);
    gulp.watch('src/js/*.js', scripts);
    gulp.watch('src/scss/*.scss', scss);
}

exports.build = gulp.series(message, gulp.parallel(html, images, scss, scripts));
exports.default = gulp.parallel(watchFiles, browserSync);
