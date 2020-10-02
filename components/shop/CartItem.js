import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Color';

const CartItem =props => {
    return (
    <TouchableOpacity style={styles.cartItem} onPress={props.onViewDetail}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity} </Text>
        <Text style={styles.text}>{props.title}</Text>
      </View>
        <View style={styles.itemData}>
            <Text style={styles.text}>${props.amount.toFixed(2)}</Text>
            <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                <Ionicons 
                    name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'} 
                    size={30} 
                    color={Colors.accent}
                />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    cartItem: {
      padding: 10,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20
    },
    itemData: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    quantity: {
      fontFamily: 'open-sans',
      color: Colors.secondaryText,
      fontSize: 16
    },
    text: {
      fontFamily: 'open-sans-bold',
      fontSize: 16
    },
    deleteButton: {
      marginLeft: 20
    }
  });

export default CartItem;