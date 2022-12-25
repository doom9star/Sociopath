module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    extend: {
      keyframes: {
        slideRight: {
          from: { transform: "translate(-100px, 0px)", opacity: 0 },
          to: { transform: "translate(0px, 0px)", opacity: 1 },
        },
        slideLeft: {
          from: { transform: "translate(0px, 0px)", opacity: 1 },
          to: { transform: "translate(-100px, 0px)", opacity: 0 },
        },
      },
      animation: {
        slideRight: "slideRight 100ms linear",
        slideLeft: "slideLeft 100ms linear",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
