import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import {storage } from '~/utils/storage';


export default defineNuxtPlugin(async (nuxtApp) => {
    // Try to get stored userId on initialization    
    const runtimeConfig = useRuntimeConfig();
    const route = useRoute();
    
    const initializeFirebase = async () => {
      try {
        
        const {id}= route.params;

        if(!id) return false;
          
        const userId = await storage.getUserId();

        const registration = await navigator.serviceWorker.register('/sw.js');

        if(registration.active){
        await navigator.serviceWorker.ready;
        
        
        const config = await fetch(runtimeConfig.public.api + '/credentials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        });

        const data = await config.json();
        const app = initializeApp(data.data);
        const messaging = getMessaging(app);
        
        const currentToken = await getToken(messaging, {
          vapidKey: data.vapid,
          serviceWorkerRegistration: registration
        });
        
        if (currentToken) {
            const response = await fetch(runtimeConfig.public.api + '/notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: currentToken, userId: userId, code: id })
                });
                  if(response.status === 200){
                    console.log('Token registered successfully');
                    return response.status == 200;
                  } 
              }

              return false;
        }
      } catch (err) {
        console.error('Error initializing Firebase:', err);
      }
    };

    
    nuxtApp.provide('initializeFirebase', initializeFirebase);
  });
  