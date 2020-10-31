import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Image } from 'react-native-elements';

import Colors from '../../constants/Color';
import HeaderButton from '../../components/UI/HeaderButton';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    const productId = props.navigation.getParam('productId');
    const selectedProduct = useSelector(state => 
        state.products.availableProducts.find(prod => prod.id === productId));

    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image source={{uri: selectedProduct.imageUrl}} style={styles.image} PlaceholderContent={<ActivityIndicator size='large' color={Colors.primaryColor} />}/>
            <View style={styles.actions}>
                <Button color={Colors.primaryColor} title="Add to Cart" 
                    onPress={() => 
                        {
                            dispatch(cartActions.addToCart(selectedProduct))
                        }
                    }/>
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    )
};

ProductDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productTitle'),
        headerBackTitle: 'Back',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} onPress={() =>{navData.navigation.navigate('Cart')}} />
            </HeaderButtons>
            )
    };
};


const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 20,
        alignItems: 'center'
    },
    price: {
        fontSize: 20,
        color: Colors.secondaryText,
        textAlign: 'center',
        marginVertical: 15,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontSize: 14,
        fontFamily: 'open-sans',
        textAlign: 'center',
        marginHorizontal: 20
    }
})

export default ProductDetailScreen;