import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import CartItem from './CartItem';
import Colors from '../../constants/Color';
import Card from '../UI/Card';

const OrderItem = props => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>${props.amount}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button color={Colors.primaryColor} title={showDetails ? "Hide Details" : "Show Details"} onPress={() => {
                setShowDetails(prevState => !prevState)
            }}/>
            {showDetails && <View style={styles.detailItems}>
                {props.items.map(cartItem => 
                    <CartItem 
                        key={cartItem.productId}
                        quantity={cartItem.quantity} 
                        amount={cartItem.sum}
                        title={cartItem.productTitle}
                    />
                )}
                <View style={styles.info}>
                    <Text style={styles.title}>Full name: {props.fullname}</Text>
                    <Text style={styles.title}>Phone: {props.phone}</Text>
                </View>
                <MapView 
                style={styles.mapStyle}  
                initialRegion={{latitude: props.latitude, longitude: props.longitude, latitudeDelta:0.01, longitudeDelta: 0.01}}
                >
                    <Marker
                    coordinate={{latitude: props.latitude, longitude: props.longitude}}
                    title={'Home'}
                    description={'Home'}
                    />
                </MapView> 
            </View>}
        </Card>
    )
};

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: Colors.secondaryText
    },
    detailItems: {
        width: '100%'
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    info: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    mapStyle: {
        width: 300,
        height: 250,
    }
});

export default OrderItem;