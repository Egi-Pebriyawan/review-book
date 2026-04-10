export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@nuxt/image-edge"],

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
});
