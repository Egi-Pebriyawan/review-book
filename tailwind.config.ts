import type { Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./composables/**/*.{js,ts}", "./app.vue"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
} satisfies Config;
