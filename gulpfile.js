const { series, parallel, src, dest, watch } = require("gulp");

const pug = require("gulp-pug");
const del = require("del");
const sass = require("gulp-sass");

const browserSync = require("browser-sync").create();

function startBrowser(done) {
  browserSync.init(
    {
      server: {
        baseDir: "./dist",
        directory: true,
      },
    },
    done
  );
}

function reloadBrowser(done) {
  browserSync.reload();
  done();
}

function compilePug() {
  return src("src/**/*.pug").pipe(pug()).pipe(dest("dist"));
}

function compileSass() {
  return src("src/**/*index.sass").pipe(sass()).pipe(dest("dist"));
}

async function cleanBuild(done) {
  await del("dist");
  done();
}

function startWatcher() {
  return watch(
    ["src/**/*.pug", "src/**/*.sass", "src/**/*.js"],
    series(parallel(compilePug, compileSass), reloadBrowser)
  );
}

exports.dev = series(
  cleanBuild,
  parallel(compilePug, compileSass),
  startBrowser,
  startWatcher
);
exports.build = series(cleanBuild, parallel(compilePug, compileSass));
exports.default = exports.dev;
