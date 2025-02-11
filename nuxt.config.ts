import * as path  from 'path';
import * as fs from 'fs';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
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
  app: {
    head: {
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},

      ]
    }
  },
  vite: {
    server: {
      allowedHosts: ['.letschoose.fr', '7be7-90-126-116-108.ngrok-free.app']
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
