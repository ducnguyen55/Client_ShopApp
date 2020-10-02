import React from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Color';

const ProductItem = props => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.onViewDetail}>
            <View style={styles.product}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: props.image}} style={styles.image}/>          
                </View>
                <View style={styles.details}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                </View>
                <View style={styles.action}>           
                    <Button color={Colors.primaryColor} title="To Cart" onPress={props.onAddToCart}/>
                </View>
            </View>
        </TouchableOpacity> 
    )
};

const styles = StyleSheet.create({
    product: {
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 300,
        margin: 20
    },
    image: {
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    title: {
        fontSize: 18,
        fontFamily: 'open-sans-bold',
        marginVertical: 0
    },
    price: {
        fontSize: 14,
        fontFamily: 'open-sans',
        color: Colors.secondaryText
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
        paddingHorizontal: 20
    },
    details: {
        alignItems: 'center',
        height: '15%',
        padding: 10
    }
});

export default ProductItem;