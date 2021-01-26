import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button ,Platform, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from "react-native-elements";
import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Color';

const ProductsOverViewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, SetError] = useState();
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.availableProducts);
    const [filteredDataSource, setFilteredDataSource] = useState();
    const [detail, setDetail] = useState(false)

    const loadProducts = useCallback(async () => {
        SetError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
            await setFilteredDataSource(products);
        } catch(err) {
            SetError(err.message);
        }
        setIsRefreshing(false);
        await setFilteredDataSource(products);
    }, [dispatch, setIsLoading, SetError]);

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource
          // Update FilteredDataSource
          const newData = products.filter(function (item) {
            const itemData = item.title
              ? item.title.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(products);
          setSearch(text);
        }
      };

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSub.remove();
        };
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        })
        setSearch('');
    }, [dispatch, loadProducts, detail]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
        setDetail(true);
        setSearch('');
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occured!</Text>
                <Button title="Try again" onPress={loadProducts} color={Colors.primaryColor} />
            </View>
        )
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found!</Text>
            </View>
        )
    }
    const ItemSeparatorView = () => {
        return (
          // Flat List Item Separator
          <View
            style={{
              height: 0.5,
              width: '100%',
              backgroundColor: '#C8C8C8',
            }}
          />
        );
    };

    const renderHeader = () => {
        return <SearchBar 
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            value={search}
            placeholder="Type Here..." lightTheme round 
        />;
    };

    return (
        <View>
            <FlatList 
                onRefresh={loadProducts}
                refreshing={isRefreshing}
                data = {search == '' ? products : filteredDataSource}
                keyExtractor={item => item.id} 
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={itemData => 
                    <ProductItem    
                        image={itemData.item.imageUrl} 
                        title={itemData.item.title}
                        price={itemData.item.price}
                        onSelect={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title);
                        }}
                    >
                        <Button 
                            color={Colors.primaryColor} 
                            title="View Detail" 
                            onPress={() => {
                                selectItemHandler(itemData.item.id, itemData.item.title);
                            }}
                        />
                        <Button 
                            color={Colors.primaryColor} 
                            title="To Cart" 
                            onPress={() => {
                                dispatch(cartActions.addToCart(itemData.item));
                            }}
                        />
                    </ProductItem>
                    
                } 
                ListHeaderComponent={renderHeader()}
            />
        </View>
    )
};

ProductsOverViewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Products',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() =>{navData.navigation.toggleDrawer();}} />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} onPress={() =>{navData.navigation.navigate('Cart')}} />
            </HeaderButtons>
            )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    textInputStyle: {
        marginLeft: 35,
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: '#009688',
        backgroundColor: '#FFFFFF',
    },
    icon: {
        position: 'absolute',
        bottom: 10,
        left: 10
    }
});

export default ProductsOverViewScreen;