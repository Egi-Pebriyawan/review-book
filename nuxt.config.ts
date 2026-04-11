export default defineNuxtConfig({
  // Prevent accidental breaking changes from future updates
  compatibilityDate: "2026-04-10",

  devtools: { enabled: true },

  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@nuxt/image"],

  supabase: {
    redirect: false,
  },

  image: {
    domains: ["books.google.com", "covers.openlibrary.org"],
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  router: {
    middleware: ["admin"],
  },
});
