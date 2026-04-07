module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b1320",
          800: "#131c2e",
          700: "#1a2740",
          600: "#26395c"
        },
        mint: {
          500: "#51d1b5",
          600: "#3fb59c"
        },
        saffron: {
          500: "#f4b546"
        },
        slateblue: {
          500: "#5b7cfa"
        }
      },
      boxShadow: {
        glass: "0 20px 50px rgba(15, 23, 42, 0.18)"
      },
      backdropBlur: {
        glass: "20px"
      }
    }
  },
  plugins: []
};
