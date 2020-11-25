var { themes, variants, plugins } = require('./tailwind/extend');

module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: themes
  },
  variants: {
    extend: variants
  },
  plugins: plugins,
};
