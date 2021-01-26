import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Color';
import Card from '../UI/Card';
import { Image } from 'react-native-elements';

const ProductItem = props => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.onSelect}>
            <Card style={styles.product}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: props.image}} style={styles.image} PlaceholderContent={<ActivityIndicator size='large' color={Colors.primaryColor} />} />
                </View>
                <View style={styles.details}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                </View>
                <View style={styles.action}>           
                    {props.children}
                </View>
            </Card>
        </TouchableOpacity> 
    )
};

const styles = StyleSheet.create({
    product: {
        height: 250,
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
        fontSize: 18,
        fontFamily: 'open-sans',
        color: Colors.secondaryText
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    }
});

export default ProductItem;