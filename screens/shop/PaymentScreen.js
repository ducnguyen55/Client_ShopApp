import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Location from 'expo-location';
import {getDistance} from 'geolib';

import HeaderButton from '../../components/UI/HeaderButton';
import LocationPicker from '../../components/Test';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Color';
import * as ordersActions from '../../store/actions/orders';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

//Cơ chế tương tự redux nhưng thật chất là useState
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const PaymentScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
      console.log(state.cart);
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        ownerId:  state.cart.items[key].ownerId
      });
    }
        return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    });
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            fullname: '',
            phone: ''
        },
        inputValidities: {
            fullname: false,
            phone: false
        },
        formIsValid: false
    });

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );
    
    const sendOrderHandler = async () => {
        setIsLoading(true);
        const location = await Location.getCurrentPositionAsync();
        var dis = getDistance(
          {latitude: location.coords.latitude, longitude: location.coords.longitude},
          {latitude: 10.755952474737242, longitude: 106.66266841132723},
        );
        
        await dispatch(ordersActions.addOrder(cartItems ,cartTotalAmount, formState.inputValues.fullname, formState.inputValues.phone, location.coords.latitude, location.coords.longitude, Math.ceil(dis / 1000 * 5000 / 1000)));
        Alert.alert('Thanks you', 'Thanks you bought my product', [{text: 'OK'}]);
        props.navigation.navigate('ProductsOverView');
        setIsLoading(false);
    }
  return (
    // <KeyboardAvoidingView
    //   behavior="padding"
    //   keyboardVerticalOffset={50}
    //   style={styles.screen}
    // >
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <LocationPicker />
        <Card style={styles.authContainer}>      
          <ScrollView>
            <Input
              id="fullname"
              label="Full name"
              required
              errorText="Please enter a valid fullname address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="phone"
              label="Phone"
              keyboardType="number-pad"
              required
              autoCapitalize="none"
              errorText="Please enter a valid phone."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size='small' color={Colors.primaryColor}/> 
              ): (
                <Button
                    title='Pay'
                    color={Colors.primary}
                    onPress={sendOrderHandler}
                />
              )}
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    // </KeyboardAvoidingView>
  );
};

PaymentScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Payment',
    headerBackTitle: 'Back',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} onPress={() =>{navData.navigation.navigate('Cart')}} />
      </HeaderButtons>
      )
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default PaymentScreen;
