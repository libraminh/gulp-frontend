import { src, series, parallel, dest, watch } from "gulp";
import sass from "gulp-sass";
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

const browserSync = browser.create();
const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_TEST === "test";

const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: ["./src/**/*.html", "./src/**/*.njk", "./src/**/*.js"],

  // This is the function used to extract class names from your templates
  defaultExtractor: (content) => {
    // Capture as liberally as possible, including things like `h-(screen-1.5)`
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

    // Capture classes within other delimiters like .block(class="w-1/2") in Pug
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

    return broadMatches.concat(innerMatches);
  },
});

const postcssPlugins = (isPurge) => [
  require("postcss-import"),
  require("tailwindcss"),
  require("autoprefixer"),
  ...(isProd && isPurge ? [purgecss] : []),
];

const paths = {
  styles: {
    src: "src/css/**/!(tailwind)*.+(scss|css)",
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
  tailwind: {
    src: "tailwind/**/*.js",
    css: "src/css/libs/tailwind.+(scss|css)",
    dest: "dist/css/",
  },
  libs: {
    src: "src/libs/**",
    dest: "dist/libs",
  },
  clean: "dist",
};

function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([paths.clean]);
}

export function styles(done) {
  src(paths.tailwind.css)
    .pipe(sass())
    .pipe(postcss(postcssPlugins(true)))
    .pipe(gulpif(isProd, cleanCSS()))
    .pipe(dest(paths.tailwind.dest))
    .pipe(browserSync.stream());

  src(paths.styles.src)
    .pipe(sass())
    .pipe(postcss(postcssPlugins(false)))
    .pipe(gulpif(isProd, cleanCSS()))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());

  done();
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
  watch(paths.styles.src, styles);
  watch(paths.images.src, images);
  watch(paths.tailwind.src, styles).on("change", browserSync.reload);
  watch(paths.scripts.src, scripts).on("change", browserSync.reload);
  watch(paths.libs.src, libs).on("change", browserSync.reload);
  watch("src/views/**/*.+(html|njk)", templates).on(
    "change",
    browserSync.reload
  );
}

exports.build = series(
  clean,
  parallel(templates, images, scripts, styles, libs)
);

exports.default = series(
  clean,
  parallel(templates, images, scripts, styles, libs),
  watchTask
);
