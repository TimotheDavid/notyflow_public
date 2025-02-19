import * as path  from 'path';
import * as fs from 'fs';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt", "@pinia/nuxt", "@nuxt/image"],
  pwa: {

    devOptions: {
        enabled: true,
    },
    registerType: 'prompt',
    injectRegister: false,
    selfDestroying: false,
    disable: true,
    client: {
      installPrompt: true
    },

  },
  vite: {
    server: {
      allowedHosts: ['.letschoose.fr']
    }
  },
  app: {
    head: {
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},

      ]
    }
  },
  ssr: false,
  runtimeConfig: {
    public: {
      api: process.env.NUXT_APP_API,
      hostname: process.env.NUXT_API_HOSTNAME
    },
  },
});
