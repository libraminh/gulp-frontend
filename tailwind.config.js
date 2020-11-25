var TailwindExtend = require('./tailwind/extend');

module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: TailwindExtend
  },
  variants: {
    extend: {
      aspectRatio: ["responsive"], // defaults to ['responsive']
    },
  },
  plugins: [require("tailwindcss-aspect-ratio")],
};
