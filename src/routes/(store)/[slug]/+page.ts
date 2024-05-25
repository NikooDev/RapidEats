import { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	console.log(params.slug);

	// Get restaurant avec where params.slug
}
