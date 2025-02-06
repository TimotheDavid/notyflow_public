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
  
  nitro: {
    devProxy: {
      '/firebase-messaging-sw.js': {
        target: ' https://7ba7-90-126-116-108.ngrok-free.app/sw/read',  // Your Express server URL
        changeOrigin: true
      }
    },
    prerender: {
      ignore: ['/manifest.json']
    }
  },
  ssr: false,
  runtimeConfig: {
    public: {
      vapid_key: process.env.NUXT_APP_VAPID_KEY,
      api: process.env.NUXT_APP_API,
      hostname: process.env.NUXT_API_HOSTNAME
    },
  },
});
