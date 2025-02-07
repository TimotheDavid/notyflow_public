// utils/storage.ts
const DB_NAME = 'NOTYFLOW';
const STORE_NAME = 'user_id';
const USER_ID_KEY = 'userId';

// Shared storage utilities
export const storage = {
  // IndexedDB operations for service worker access
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      
      request.onupgradeneeded = (event) => {
        //@ts-ignore
        const db = event.target?.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  },

  async saveUserId(userId: string) {


    console.log(userId);
    
    // Save to localStorage for app access
    localStorage.setItem(USER_ID_KEY, userId);
    
    // Save to IndexedDB for service worker access
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = (db as any).transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      console.log(store);

      console.log(userId);
      
      
      const request = store.add({ key: USER_ID_KEY, value: userId });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  async getUserId() {
    // Try localStorage first (faster)
    const localUserId = localStorage.getItem(USER_ID_KEY);

    console.log({ localUserId});
    
    if (localUserId) return localUserId;
    
    // Fallback to IndexedDB
    const db = await this.initDB();
    return new Promise((resolve, reject) => {


        
      const transaction = (db as any).transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(USER_ID_KEY);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
};
