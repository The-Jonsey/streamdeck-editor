const gulp = require('gulp');

gulp.task('css', () => {
    const postcss = require('gulp-postcss');

    return gulp.src('resources/css/app.css')
        .pipe(postcss([
            require('tailwindcss')('./tailwind.config.js'),
            require('autoprefixer'),
        ]))
        .pipe(gulp.dest('webroot/css'))
});

gulp.task('watch', () => {
    gulp.watch('resources/**/*.css', gulp.parallel(['css']));
});
