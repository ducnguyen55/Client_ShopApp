import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';

import ProductsOverViewScreen from '../screens/shop/ProductsOverViewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdesScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import Colors from '../constants/Color';
import { Platform } from 'react-native';

const defaultNavOptions = {
    title: 'Products',
    headerStyle: {
        backgroundColor: Colors.dark
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
        textAlign: 'center'
    },
    headerTintColor: Colors.text
}

const ProductsNavigator = createStackNavigator (
    {
    ProductsOverView: ProductsOverViewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
    }, 
    {   
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons   name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                            size={23}
                            color={Colors.accent}
                />
            )
        },
        defaultNavigationOptions: defaultNavOptions
    }
);

const OrdersNavigator = createStackNavigator(
    {
        Orders: OrdesScreen
    }, 
    {   
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons   name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                            size={23}
                            color={Colors.accent}
                />
            )
        },
        defaultNavigationOptions: defaultNavOptions
    }
)

const AdminNavigator = createStackNavigator(
    {
        UserProducts: UserProductsScreen,
        EditProduct: EditProductScreen
    }, 
    {   
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons   name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
                            size={23}
                            color={Colors.accent}
                />
            )
        },
        defaultNavigationOptions: defaultNavOptions
    }
)

const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primaryColor
    }
});

export default createAppContainer(ShopNavigator);