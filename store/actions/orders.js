export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (ownerId, cartItem, totalAmount) => {
    return {type: ADD_ORDER, orderData: {ownerId: ownerId, items: cartItem, amount: totalAmount}};
}