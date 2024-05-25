// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { DecodedIdToken } from 'firebase-admin/auth';
import { CompositionEventHandler } from 'svelte/elements';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: DecodedIdToken | null | undefined,
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface Error {
		code: string
	}
	interface String {
		toCapitalize(): string;
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:click_outside'?: CompositionEventHandler
		}
	}
}

export {};
