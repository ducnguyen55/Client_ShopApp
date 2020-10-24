import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Color';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    // state -> orders đầu tiên là sẽ vào App.js cái thứ 2 là của reducers
    const orders = useSelector(state => state.orders.orders)
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(ordersActions.fetchOrders()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primaryColor} />
        </View>
    }

    if (orders.length === 0) {
        return <View style={styles.centered}>
            <Text>No order found</Text>
        </View>
    }

    return (
        <FlatList 
            data={orders} 
            keyExtractor={item => item.id} 
            renderItem={itemData => 
                <OrderItem 
                    amount={itemData.item.totalAmount} 
                    date={itemData.item.date}
                    items={itemData.item.items}
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

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrdersScreen;