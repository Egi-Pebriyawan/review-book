export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Kalau route tujuan adalah halaman admin
  if (to.path.startsWith('/admin')) {
    // Dan user belum login
    if (!user.value) {
      return navigateTo('/login');
    }
  }
});
