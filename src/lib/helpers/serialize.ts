String.prototype.toCapitalize = function() {
	if (this === null || this.length === 0) {
		return '';
	}

	return this.charAt(0).toUpperCase() + this.slice(1);
};

export const formatTitletoUrl = (title: string): string => {
	// Fonction pour enlever les accents
	const removeAccents = (str: string): string => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	// Enlever les accents
	let result = removeAccents(title);

	// Supprimer les caractères spéciaux
	result = result.replace(/[^a-zA-Z0-9\s]/g, '');

	// Remplacer les espaces par des tirets
	result = result.replace(/\s+/g, '-');

	// Convertir en minuscules
	result = result.toLowerCase();

	return result;
}
