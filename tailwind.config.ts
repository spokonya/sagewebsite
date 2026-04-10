import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        "surface-border": "var(--surface-border)",
        
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        
        accent: {
          DEFAULT: "var(--accent)",
          dim: "var(--accent-dim)",
          glow: "var(--accent-glow)",
          secondary: "var(--accent-secondary)",
        },
        
        system: {
          success: "var(--success)",
          error: "var(--error)",
        },

        phone: {
          body: "#111110",
          screen: "#131210",
          notch: "#080808",
          lens: "#161514"
        }
      },
      fontFamily: {
        display: ["Bagnard Sans", "serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)"
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
      },
      maxWidth: {
        container: "1160px"
      },
      transitionTimingFunction: {
        sage: "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      screens: {
        nav: "901px"
      }
    }
  },
  plugins: []
};

export default config;
