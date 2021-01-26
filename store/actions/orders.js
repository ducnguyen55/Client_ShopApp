import Orders from '../../models/order';
import Sell from '../../models/sell';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';
export const SET_SELL = 'SET_SELL';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
      const userId = getState().auth.userId;
      try {
        const response = await fetch(
            `https://shopapp-8a6fd.firebaseio.com/orders/${userId}.json`
        );
  
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
  
        const resData = await response.json();
        const loadedOrders = [];

        for (const key in resData) {
          loadedOrders.push(
            new Orders(
              key,
              userId,
              resData[key].cartItems,
              resData[key].totalAmount,
              new Date(resData[key].date),
              resData[key].fullname,
              resData[key].phone,
              resData[key].latitude,
              resData[key].longitude,
              resData[key].feeship,
            )
          );
        }
        dispatch({ type: SET_ORDERS, orders: loadedOrders });
      } catch (err) {
        throw err;
      }
    };
  };

export const addOrder = (cartItems, totalAmount, fullname, phone, latitude, longitude, feeship) => {
    return async (dispatch, getState) => {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
        const date = new Date();
        const response = await fetch(`https://shopapp-8a6fd.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              cartItems,
              totalAmount,
              fullname,
              phone,
              latitude,
              longitude,
              feeship,
              date: date.toISOString()
            })
          });
      
        if (!response.ok) {
            throw new Error('Error');
        }

        const resData = await response.json();
        
        dispatch({
            type: ADD_ORDER,
            orderData: { 
                id: resData.name, 
                items: cartItems, 
                amount: totalAmount,
                fullname: fullname,
                phone: phone,
                latitude: latitude,
                longitude: longitude,
                feeship: feeship,
                date: date
            }
        });
    } 
}

export const fetchSell = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const fullorders = await fetch(
        `https://shopapp-8a6fd.firebaseio.com/orders.json`
      );

      const resOrder = await fullorders.json();

      const loadedSell = [];

      for(const userOrder in resOrder){
        const response = await fetch(
          `https://shopapp-8a6fd.firebaseio.com/orders/${userOrder}.json`
        );
        const resData = await response.json();
        for (const key in resData) {
          const cartItem = [];
          var SelltotalAmount = 0
          for (var i = 0; i < resData[key].cartItems.length; i++)
          {
            if(userId === resData[key].cartItems[i].ownerId){
              cartItem.push(resData[key].cartItems[i]);
              SelltotalAmount = SelltotalAmount + resData[key].cartItems[i].productPrice*resData[key].cartItems[i].quantity
            }
          }
          console.log(cartItem);
          if(cartItem.length !== 0) {
            loadedSell.push(  
              new Sell(
                key,
                userId,
                cartItem,
                SelltotalAmount,
                new Date(resData[key].date),
                resData[key].fullname,
                resData[key].phone,
                resData[key].latitude,
                resData[key].longitude
              )
            );
          }
        }
      }
      // for (const key in resData) {
      //   const cartItem = [];
      //   for (var i = 0; i < resData[key].cartItems.length; i++)
      //   {
      //     if(userId.trim() === resData[key].cartItems[i].ownerId.trim()){
      //       cartItem.push(resData[key].cartItems[i]);
      //     }
      //   }
      //   console.log(cartItem);
      //   if(cartItem.length !== 0) {
      //     loadedSell.push(  
      //       new Sell(
      //         key,
      //         userId,
      //         cartItem,
      //         resData[key].totalAmount,
      //         new Date(resData[key].date),
      //         resData[key].fullname,
      //         resData[key].phone,
      //         resData[key].latitude,
      //         resData[key].longitude
      //       )
      //     );
      //   }
      // }
      dispatch({ type: SET_SELL, sell: loadedSell });
    } catch (err) {
      throw err;
    }
  };
};