import * as path  from 'path';
import * as fs from 'fs';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},

      ]
    }
  },
  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com']
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
