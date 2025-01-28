import * as path  from 'path';
import * as fs from 'fs';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  ssr: false,
  runtimeConfig: {
    public: {
      vapid_key: process.env.NUXT_APP_VAPID_KEY,
      api: process.env.NUXT_APP_API
    },
  },
});
