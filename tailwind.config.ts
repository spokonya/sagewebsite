import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#1E1D1A", raised: "#262523" },
        surface: "rgba(214,214,214,0.04)",
        line: "rgba(214,214,214,0.08)",
        "line-active": "rgba(148,168,126,0.35)",
        dust: {
          DEFAULT: "#D6D6D6",
          dim: "rgba(214,214,214,0.55)",
          ghost: "rgba(214,214,214,0.25)"
        },
        sage: {
          DEFAULT: "#94A87E",
          soft: "rgba(148,168,126,0.10)",
          glow: "rgba(148,168,126,0.25)",
          hover: "#a2b68e"
        },
        dusk: { DEFAULT: "#9B8A7A", soft: "rgba(155,138,122,0.10)" },
        phone: {
          body: "#111110",
          screen: "#131210",
          notch: "#080808",
          lens: "#161514"
        }
      },
      fontFamily: {
        display: ["Bagnard Sans", "serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-outfit)", "Outfit", "sans-serif"]
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "28px"
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
