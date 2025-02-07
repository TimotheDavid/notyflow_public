// utils/storage.ts
const DB_NAME = 'NOTYFLOW';
const STORE_NAME = 'user_id';
const USER_ID_KEY = 'userId';
import Dexie, { type EntityTable} from 'dexie';


interface NotyflowDatabase {
  id: number,
  user_id: string;
}

// Shared storage utilities
export const storage = {
  // IndexedDB operations for service worker access
  async initDB() {
      const db = new Dexie(DB_NAME) as Dexie & {
        user: EntityTable<NotyflowDatabase, 'id'>;
      };
      return db;
  },

  async saveUserId(userId: string) {    
    localStorage.setItem(USER_ID_KEY, userId);
    
    const db = await this.initDB();

    const record = {
      user_id: userId
    }

    const current = await this.getUserId();
    !current ? db.user.add(record) : db.user.put({ id: 1, user_id: userId});
    
  },

  async getUserId() {
    const localUserId = localStorage.getItem(USER_ID_KEY);

    console.log({ localUserId});
    
    if (localUserId) return parseInt(localUserId);

    const db = await  this.initDB();

    const current = await db.user.get(1);

    return current?.user_id ?? null;
  }
};
