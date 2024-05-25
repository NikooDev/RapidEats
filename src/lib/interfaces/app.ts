export interface SettingsType {
	maps: boolean
	overlay?: boolean
}

export type KeySettingsType = keyof SettingsType;
