import { src, series, parallel, dest, watch } from "gulp";
import cleanCSS from "gulp-clean-css";
import imagemin from "gulp-imagemin";
import browser from "browser-sync";
import babel from "gulp-babel";
import terser from "gulp-terser";
import nunjucks from "gulp-nunjucks";
import del from "del";
import postcss from "gulp-postcss";
import gulpif from "gulp-if";
import concat from "gulp-concat";
import dartSass from "sass";
import gulpSass from "gulp-sass";

const sass = gulpSass(dartSass);

const browserSync = browser.create();
const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_TEST === "test";

const paths = {
  styles: {
    src: "src/css/main.scss",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js/",
  },
  templates: {
    src: "src/views/*.+(html|njk)",
    dest: "dist/",
  },
  images: {
    src: "src/images/**",
    dest: "dist/images",
  },
  libs: {
    src: "src/libs/**",
    dest: "dist/libs",
  },
  fonts: {
    src: "src/fonts/**",
    dest: "dist/fonts",
  },
  clean: "dist",
};

function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([paths.clean]);
}

export function styles() {
  function callback() {
    return {
      plugins: [
        require("postcss-import"),
        require("tailwindcss/nesting"),
        require("tailwindcss"),
        require("autoprefixer"),
        require("postcss-preset-env")({ features: { "nesting-rules": false } }),
      ],
      options: {
        parser: require("postcss-scss"),
      },
    };
  }

  return src(paths.styles.src)
    .pipe(postcss(callback))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpif(isProd, cleanCSS()))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

export function scripts() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulpif(isProd, terser()))
    .pipe(concat("main.js"))
    .pipe(dest(paths.scripts.dest));
}

export function images() {
  return src(paths.images.src)
    .pipe(gulpif(isProd && !isTest, imagemin()))
    .pipe(dest(paths.images.dest));
}

export function libs() {
  return src(paths.libs.src).pipe(dest(paths.libs.dest));
}

export function fonts() {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dest));
}

export function templates() {
  return src(paths.templates.src)
    .pipe(nunjucks.compile())
    .pipe(dest(paths.templates.dest));
}

export function watchTask() {
  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "/index.html",
    },
  });
  watch("src/css/**/*.scss", styles);
  watch(paths.images.src, images);
  watch(paths.scripts.src, scripts).on("change", browserSync.reload);
  watch(paths.libs.src, libs).on("change", browserSync.reload);
  watch("src/views/**/*.+(html|njk)", parallel(templates, styles)).on(
    "change",
    browserSync.reload
  );
  watch(["./tailwind.config.js"], parallel(templates, styles)).on(
    "change",
    browserSync.reload
  );
}

exports.build = series(
  clean,
  parallel(templates, images, scripts, styles, libs, fonts)
);

exports.default = series(
  clean,
  parallel(templates, images, scripts, styles, libs, fonts),
  watchTask
);
