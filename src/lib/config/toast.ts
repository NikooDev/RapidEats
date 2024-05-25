import type { ToastSettings } from '@skeletonlabs/skeleton';

const toast = 'bg-white border-b-4 font-semibold text-slate-800'

export const toastSuccess = {
	background: `border-green-500 ${toast}`
} as ToastSettings;

export const toastError = {
	background: `border-red-500 ${toast}`
} as ToastSettings;

export const toastInfo = {
	background: `border-slate-500 ${toast}`,
	hideDismiss: true
} as ToastSettings;
