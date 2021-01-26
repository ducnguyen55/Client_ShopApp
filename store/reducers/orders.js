import { ADD_ORDER, SET_ORDERS, SET_SELL } from '../actions/orders';
import Order from '../../models/order';
const initialState = {
    orders: [],
    sell: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders
            };
        case SET_SELL:
            return {
                ...state,
                sell: action.sell
            };
        case ADD_ORDER:
            console.log(action.orderData);
            const newOrder = new Order(
                action.orderData.id, 
                action.orderData.ownerId, 
                action.orderData.items, 
                action.orderData.amount,
                action.orderData.date,
                action.orderData.fullname,
                action.orderData.phone,
                action.orderData.latitude,
                action.orderData.longitude,
                action.orderData.feeship,
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder),
                ...state
            }
    }
    return state;
}