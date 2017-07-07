const gulp = require('gulp')
const ts = require('gulp-typescript')
const browserSync = require('browser-sync').create()

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })

    gulp.watch('app/**/*').on('change', browserSync.reload)
})

gulp.task('build-typescript', () => {
    return gulp.src('src/ts/*.ts')
    .pipe(ts())
    .pipe(gulp.dest('app/assets/js'))
})

gulp.task('watch', ['browserSync'], () => {
    gulp.watch('src/ts/*.ts', ['build-typescript'])
})
