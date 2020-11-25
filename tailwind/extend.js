const screenSizes = {
  xs: 520,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const screens = {
  // Mobile first breakpoints
  xs: screenSizes.xs + "px",
  sm: screenSizes.sm + "px",
  md: screenSizes.md + "px",
  lg: screenSizes.lg + "px",
  xl: screenSizes.xl + "px",
  "2xl": screenSizes["2xl"] + "px",

  // Desktop first breakpoints
  "d-sm": { max: screenSizes.sm - 1 + "px" },
  "d-md": { max: screenSizes.md - 1 + "px" },
  "d-lg": { max: screenSizes.lg - 1 + "px" },
  "d-xl": { max: screenSizes.xl - 1 + "px" },
  "d-2xl": { max: screenSizes["2xl"] - 1 + "px" },
};


module.exports = {
  screens,
  aspectRatio: {
    // defaults to {}
    none: 0,
    square: [1, 1], // or 1 / 1, or simply 1
    "16/9": [16, 9], // or 16 / 9
    "4/3": [4, 3], // or 4 / 3
    "21/9": [21, 9], // or 21 / 9
  },
  flex: {
  },
  borderWidth: {
  },
  padding: {
  },
  margin: {
  },
  colors: {
    white: "#ffffff",
    black: "#000000",
  },
  spacing: {
  },
  translate: {
  },
  scale: {
  },
  fontSize: {
  },
  lineHeight: {
  },
  width: {
  },
  height: {
  },
  maxWidth: {
  },
  minWidth: {
  },
  inset: {
  },
  borderRadius: {
  },
  fontFamily: {
  },
}