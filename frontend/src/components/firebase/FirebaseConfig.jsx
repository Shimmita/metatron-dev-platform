import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// google provider
const providerGoogle = new GoogleAuthProvider();
const providerGithub = new GithubAuthProvider();
providerGithub.addScope("user");
const providerMicrosoft = new OAuthProvider("microsoft.com");
providerMicrosoft.addScope("profile");
providerMicrosoft.addScope("email");
providerMicrosoft.addScope("openid");
// Optional: Configure additional settings, if needed.
providerMicrosoft.setCustomParameters({
  prompt: "select_account",
});

export { auth, providerGoogle, providerMicrosoft,providerGithub };
