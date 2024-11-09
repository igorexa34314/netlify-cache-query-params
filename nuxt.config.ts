// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   app: {
      head: { htmlAttrs: { style: 'background-color: #191F25; color: #ffffff' } },
   },
   routeRules: {
      '/leaderboard-with-path-params/**': { swr: true },
      '/leaderboard-with-query/**': { swr: true },
      '/leaderboard-with-query-isr/**': { isr: true },
      '/leaderboard-with-path-params-isr/**': { isr: true },
   },
   compatibilityDate: '2024-11-01',
   devtools: { enabled: true },
   modules: ['@vueuse/nuxt'],
});
