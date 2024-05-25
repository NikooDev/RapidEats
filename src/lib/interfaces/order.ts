import MenuType from '$lib/interfaces/menu';
import DisheType from '$lib/interfaces/dishe';
import { DeliverymanType, RestaurantType } from '$lib/interfaces/user';

enum OrderEnum {
	PENDING = 'pending',
	IN_DELIVERY = 'in_delivery',
	DELIVERED = 'delivered'
}

interface OrdersInfosType {
	menus: MenuType[],
	dishes: DisheType[],
	restaurant: RestaurantType
	deliveryman: DeliverymanType
	status: OrderEnum
}

interface OrderType {
	userUID: string
	orders: OrdersInfosType[]
}

export default OrderType;
