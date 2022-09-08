let project_folder = "dist";
let source_folder = "#src";

let path = {
  build: {
    html: project_folder+"/",
    css: project_folder+"/css/",
    js: project_folder+"/js/",
    assets: project_folder+"/assets/"
  },
  src: {
    html: [source_folder + "/*.html", "!"+source_folder + "/components/*.html"],
    css: source_folder+"/scss/*.scss",
    js: source_folder+"/js/script.js",
    assets: source_folder+"/assets/**/*.{jpg,png,svg,gif,ico,webp,pdf}"
  },
  watch: {
    html: source_folder+"/**/*.html",
    css: source_folder+"/scss/**/*.scss",
    js: source_folder+"/js/**/*.js",
    assets: source_folder+"/assets/**/*.{jpg,png,svg,gif,ico,webp,pdf}"
  },
  clean: "./"+project_folder+"/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    sass = require('gulp-dart-sass'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin')
;

/**
 * start live coding
 */
function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}

/**
 * working with html files
 */
function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

/**
 * working with css files
 */
function css() {
  return src(path.src.css)
  .pipe(sass({outputStyle: "compressed"}))
  .pipe(concat('style.css'))
  .pipe(csso())
  .pipe(dest(path.build.css))
  .pipe(browsersync.stream());
}

/**
 * working with js files
 */
 function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

/**
 * working with assets
 */
 function assets() {
  return src(path.src.assets)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
      })
    )
    .pipe(dest(path.build.assets))
    .pipe(browsersync.stream());
}


/**
 * watching html file
 */
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
}

/**
 * clen dist folder
 */
function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, assets));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.assets = assets;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
