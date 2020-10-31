import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import ProductsOverViewScreen from '../screens/shop/ProductsOverViewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdesScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import PaymentScreen from '../screens/shop/PaymentScreen';
import StartupScreen from '../screens/StartupScreen';
import Colors from '../constants/Color';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import * as authActions from '../store/actions/auth';

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
    Payment: PaymentScreen,
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
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return <View style={{ flex: 1, padding: 20 }}>
            <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                <DrawerItems {...props} />
                <Button title="Logout" color={Colors.primaryColor} onPress={() => {
                    dispatch(authActions.logout());
                    props.navigation.navigate('Auth');
                }}/>
            </SafeAreaView>
        </View>
    }
});

const AuthNavigator = createStackNavigator(
    {
        Auth: AuthScreen
    },
    {
        defaultNavigationOptions: defaultNavOptions
    }
)

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);