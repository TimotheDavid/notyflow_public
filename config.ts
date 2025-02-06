import { initializeApp} from 'firebase/app'; 
import {getMessaging} from 'firebase/messaging';


const firebaseConfig = {
  apiKey: "AIzaSyCCL-xbmVszB4osFE8qlrQW8IZM__5HjVQ",
  authDomain: "spush-35d6a.firebaseapp.com",
  projectId: "spush-35d6a",
  storageBucket: "spush-35d6a.firebasestorage.app",
  messagingSenderId: "316988662055",
  appId: "1:316988662055:web:0660538cd7e0976bb04902",
  measurementId: "G-M18SSDXF78",
};




const app = initializeApp(firebaseConfig);


export { app };
