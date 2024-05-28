import MenuType from '$lib/interfaces/menu';
import DisheType from '$lib/interfaces/dishe';
import { DeliverymanType, RestaurantType } from '$lib/interfaces/user';

enum OrderEnum {
	PENDING = 'pending',
	IN_DELIVERY = 'in_delivery',
	DELIVERED = 'delivered'
}

interface OrderType {
	menus: MenuType[],
	dishes: DisheType[],
	restaurant?: RestaurantType
	deliveryman?: DeliverymanType
	status: OrderEnum
	total: number
}

export default OrderType;
