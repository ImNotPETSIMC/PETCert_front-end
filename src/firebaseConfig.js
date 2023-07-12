import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const apiKey = process.env.REACT_APP_API_KEY;
const authDomain = process.env.REACT_APP_AUTH_DOMAIN;
const projectId = process.env.REACT_APP_PROJECT_ID;

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain, 
    projectId: projectId
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseDB = getFirestore(firebaseApp);
