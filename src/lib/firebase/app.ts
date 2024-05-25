import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';
import { type Auth } from 'firebase/auth';
import { browser } from '$app/environment';
import firebaseConfig from '$lib/config/firebase';

export let db: Firestore;
export let app: FirebaseApp;
export let auth: Auth;

/**
 * @description Initialisation du client Firebase
 */
const initializeFirebase = () => {
	if (!browser) {
		throw new Error('Can\'t use the Firebase client on the server.');
	}

	if (!getApps().length) {
		app = initializeApp(firebaseConfig);
		db = getFirestore(app);
		auth = getAuth(app);
	}
};

export default initializeFirebase;
