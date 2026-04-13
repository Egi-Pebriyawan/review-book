export default defineNuxtConfig({
  // Prevent accidental breaking changes from future updates
  compatibilityDate: "2026-04-10",

  devtools: { enabled: true },

  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@nuxt/image", "@nuxtjs/ngrok"],
  ngrok: {
    authtoken: "3CFnwIYHuzakSpmD1sIrhQNRGnq_23NjY1eFwLgE1iqBbWpNN", // Masukkan token kamu di sini
  },
  vite: {
    server: {
      allowedHosts: ["cobweb-turret-unreeling.ngrok-free.dev"],
    },
  },

  supabase: {
    redirect: false,
  },

  // Load Google Fonts
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          name: "google-site-verification",
          content: "ckZSQuDDO3riptg_wenLYLiUAirsHBQL7eoULy625vs",
        },
      ],
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },

  image: {
    domains: ["books.google.com", "covers.openlibrary.org"],
  },

  router: {
    middleware: ["admin"],
  },
});
