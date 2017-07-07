const browserSync = require('browser-sync').create()

browserSync.init({
    server: {
        baseDir: 'app'
    }
})
