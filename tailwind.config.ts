import type { Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./composables/**/*.{js,ts}", "./app.vue"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
} satisfies Config;
