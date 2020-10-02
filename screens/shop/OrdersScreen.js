import React from 'react';
import { Text, FlatList, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

const OrdersScreen = props => {
    // state -> orders đầu tiên là sẽ vào App.js cái thứ 2 là của reducers
    const orders = useSelector(state => state.orders.orders)
    return (
        <FlatList 
            data={orders} 
            keyExtractor={item => item.id} 
            renderItem={itemData => 
                <OrderItem 
                    amount={itemData.item.totalAmount} 
                    date={itemData.item.date}
                />
            }
        />
    )
}

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Orders' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() =>{navData.navigation.toggleDrawer();}} />
            </HeaderButtons>
        )
    }
};

export default OrdersScreen;