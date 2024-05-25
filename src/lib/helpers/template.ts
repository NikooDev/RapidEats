import { RestaurantType } from '$lib/interfaces/user';

export const mapPopup = (restaurant: RestaurantType) => {
	return `
		<a href="/${restaurant.slug}" class="group focus:outline-0">
			<div class="overflow-hidden rounded-t-lg">
				<div class="h-36">
					<img src="${restaurant.coverURL}" class="object-cover rounded-t-lg h-full w-full scale-[1] group-hover:scale-[1.1] transition-all duration-300" alt="${restaurant.title}"/>
				</div>
			</div>
			<div class="py-2 px-4">
				<p class="font-bold text-lg text-slate-800">${restaurant.title.toCapitalize()}</p>
				<p class="font-medium text-slate-800 text-sm mt-2">${restaurant.description.toCapitalize()}</p>
				<div id="note-${restaurant.uid}" class="flex justify-end mt-3"></div>
			</div>
		</a>
	`;
}

export const mapMarker = () => {
	return `
		<button class="custom-marker bg-white h-8 w-8 shadow-md flex group justify-center items-center rounded-full border-2 border-white hover:border-2 hover:border-pink-600 transition-colors duration-300">
			<svg xmlns="http://www.w3.org/2000/svg" class="fill-slate-800 group-hover:fill-pink-600 transition-colors duration-300" height="16" width="16" viewBox="0 0 512 512">
				<path d="M464 256H48a48 48 0 0 0 0 96h416a48 48 0 0 0 0-96zm16 128H32a16 16 0 0 0-16 16v16a64 64 0 0 0 64 64h352a64 64 0 0 0 64-64v-16a16 16 0 0 0-16-16zM58.64 224h394.72c34.57 0 54.62-43.9 34.82-75.88C448 83.2 359.55 32.1 256 32c-103.54.1-192 51.2-232.18 116.11C4 180.09 24.07 224 58.64 224zM384 112a16 16 0 1 1-16 16 16 16 0 0 1 16-16zM256 80a16 16 0 1 1-16 16 16 16 0 0 1 16-16zm-128 32a16 16 0 1 1-16 16 16 16 0 0 1 16-16z"></path>
			</svg>
		</button>
	`;
}
