/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from 'firebase-functions/lib/v2';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

setGlobalOptions({region: 'europe-west1'});

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: 'svelte-96d39',
		clientEmail: 'firebase-adminsdk-dyx8y@svelte-96d39.iam.gserviceaccount.com',
		privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCc2gsDMlcQq0SE\nHvSyT4RDyhw2z2DSfMTd7W1cjWJN32I5Ge5aYV7kxyt685eBTnTWqUuLJDOVkDRB\noGvHSs6slBJ6xc16nkFR2t3u/MJnuCOK9KrWYyh2td5KKtQ14RFBpOdQZ+EM90aE\nZp7VenPl5wIFaDRC5SDpN+lcDmSragWrEnQM5+5Z8gDWl4xCKV6KIBun/a+Zp6TY\n284kBa3cFBKx7nQlOO35VJ+c8Mwz1KaQHtGsxcniOrUoBGpGvjAID33Y3c/XgKYO\nmk0b59i/QfXw3bD8dZ7q96ZUYE4vyIx9vt5oLmAtCOqsmjYqlwA/1TLYEf0iA8nh\nVZ1Q2YGtAgMBAAECggEABffXWYeJxj9YcJuGulGQVsD8g/Et/eXtjerNEYUd4Ev3\nfls4SJWYYsv/4XvrAAQZ3RodEjE6/XE6rJcu5ESHKr9jZZ41pF/PQsIfopdY/h43\n5TKY9n/Ye0EOMUdbnD8EWFMiBXS/Ni5WSOiCGV1BRpZP3oZ/9V5BCC0bTFt0cdlo\n+rfothXU5tU6AFMwUmFKAkLdK87NQEhQzQehb+pNNgYKraAXU7FtgBdlh54dR0mm\nK6A0PHbAI2AWmKJGvkHwT2LuHPnQNvaXPScg4Bo0w5PCZFizrdE4dG7ZHuqo93uX\niusC0Sx4iCC7RKV3s85mZaWasKSerZmeq+8RERHFGQKBgQDRYGSPhROn7b+1iKwi\n1JE8otNnjsIKsbisEwg8jw78AkTZSW2bAABkoRKlc5wgBMNEJsR7dR1ceqmdFhwn\n2qajDx2eXkdikaCb2R4O2WkIAmPV+ZPR+ohhpujGgW4WYui+gXtazw4Jkiv6S8zf\nPCPMy3RN5WM6nVOxw0kCUEswWQKBgQC/x3L/kR7n2Z1R0ruaYUTLJ7eHaxpDWq5K\nxLRGo9SAONZNciLTfYtnqjjuPGaNJjiJ1KliZCHFrLyj9/e7mCk2LjIqD7B6XVZ0\nJn1tEJQXE9bn5a7QmN0ei1R8+b+vVtbRt1JPGqjm93Tgl1eT2l/b/4uXn8nIeckX\nAh3PtaqRdQKBgDxcu+EcjpQlWNWvN2E7Qzvl/WinoY2PuxvwyLkczUceKFc0ciLz\nlylrvoJwmBwrA1iMjKzDENnuiyO8khVzVgNAglt79ryWG2WS7LV/PGaQudOghltN\nDTCJ/CXufpx5m3wAvF1rwDJGL+OTItdg8TlDlp42easWXGCtWkkOeP7RAoGABp9F\nekuxjIH4K7YiIj+Pl5BEhxmMq5y6/fvy2amYkeDkjYIOb80a/jZjht5xEBisxR2h\nx7L7c472aJcMZ97mNWe89bTa/C6y6InXtOdopa9asWE9+xf8MqzO+w3Ir65I9q7k\n2bRq9qa+026GaKWWv8sAL/klh5Wk+vVowB5eyG0CgYA9IO9yqPc7KwETgK5jySKO\niU1hix9ZKDZ0Lfd/d584pq/lhoj+eSfDLi1R/sCpfxpDsjraoELksQMamQco3SQE\noDEBtJgUQugbqaCkz3aCZYIPi96NJvuMgaoyAHwdo+gHaKwCWR+JrRh1n1s8Tx9J\n2fcFhi0vjCAohgnfit5RSg==\n-----END PRIVATE KEY-----\n'
	})
});

const db = admin.firestore();

export const onDeliveryman = onDocumentCreated('orders/{docId}', async (event) => {
	event.params.docId; // uid du document

	const restaurants = await db
		.collection('users').orderBy('created', 'asc')
		.where('role', '==', 'restaurant')
		.get();

	logger.info(restaurants.docs.map((doc) => doc.data()));

	/**
	 * A FAIRE : Lorsqu'une commande est créée, le livreur associé à la commande change de status
	 */
});
