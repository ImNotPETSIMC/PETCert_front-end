import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID } from "./getEnv";

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN, 
    projectId: PROJECT_ID
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseDB = getFirestore(firebaseApp);
