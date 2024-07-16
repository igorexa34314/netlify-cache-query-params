// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: { htmlAttrs: { style: 'background-color: #191F25; color: #ffffff' } },
	},
	routeRules: {
		'/leaderboard-with-path-params/**': { swr: 60 },
		'/leaderboard-with-query/**': { swr: 60, headers: { 'Netlify-Vary': 'query=type' } },
	},
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	modules: ['@vueuse/nuxt'],
});
