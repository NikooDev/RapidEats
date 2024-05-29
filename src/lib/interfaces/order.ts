import MenuType from '$lib/interfaces/menu';
import DisheType from '$lib/interfaces/dishe';
import { DeliverymanType, RestaurantType } from '$lib/interfaces/user';

enum OrderEnum {
	IN_CART = 'in_cart',
	PENDING = 'pending',
	IN_DELIVERY = 'in_delivery',
	DELIVERED = 'delivered'
}

interface OrderType {
	menus: MenuType[],
	dishes: DisheType[],
	restaurant: RestaurantType
	deliveryman?: DeliverymanType
	status: OrderEnum
	total: number
}

export interface CartMenuType {
	uid: string
	restaurantUID: string
	restaurantTitle: string
	title: string
	quantity: number
	price: number
	items: CartMenuType[];
}

export interface CartType {
	[uid: string]: CartMenuType;
}

export default OrderType;
