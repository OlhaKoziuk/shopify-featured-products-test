const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

function compileSCSS() {
    return src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename('theme.css'))
        .pipe(dest('assets'));
}

function watchTask() {
    watch('src/scss/**/*.scss', compileSCSS);
}

exports.default = series(compileSCSS, watchTask);
