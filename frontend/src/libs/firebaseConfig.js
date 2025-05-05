import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlZ5Ow9Ttc3nRfMJxIsEvLshWpjlD6bkA",
  authDomain: "personal-finance-tracker-99f34.firebaseapp.com",
  projectId: "personal-finance-tracker-99f34",
  storageBucket: "personal-finance-tracker-99f34.appspot.com",
  messagingSenderId: "1031090148197",
  appId: "1:246763016400:web:d694f62f596c1a54990ed5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
