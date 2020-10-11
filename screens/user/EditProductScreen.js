import React, { useEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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
        let updateFormIsValid = true;
        for (const key in updatedValidities) {
            // Chạy hết để xem formIsValid ra true hay false
            updateFormIsValid = updateFormIsValid && updatedValidities[key];
        };
        return {
            formIsValid: updateFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const EditProductScreen = props => {
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    );
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        }, 
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        }, 
        formIsValid: false
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid ) {
            Alert.alert('Wrong input!','Please input a field.', [{text: 'OK'}]);
            return;
        }
        if (editedProduct) {
            dispatch(
                productsActions.updateProduct(
                    prodId, 
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl
                )
            );
        } else {
            dispatch(
                productsActions.createProduct(
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl, 
                    +formState.inputValues.price
                )
            );
        }
        props.navigation.goBack();
    }, [dispatch, prodId,  formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const textChangeHandler = (inputIdentifier, text) => {
        let isValid = false;
        if (text.trim().length > 0) {
            isValid = true;
        }
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: text,
            isValid: isValid,
            input: inputIdentifier
        })
    };

    return (
    <ScrollView>
        <View style={styles.form}>
        <View style={styles.formControl}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={formState.inputValues.title}
                onChangeText={textChangeHandler.bind(this, 'title')}
                keyboardType='default'
                autoCapitalize='sentences'
                autoCorrect
                returnKeyType='next'
                required
            />
            {!formState.inputValidities.title && <Text>Please enter a valid title!</Text>}
        </View>
        <View style={styles.formControl}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
            style={styles.input}
            value={formState.inputValues.imageUrl}
            onChangeText={textChangeHandler.bind(this, 'imageUrl')}
            required
            />
        </View>
            {editedProduct ? null : (
            <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
            style={styles.input}
            value={formState.inputValues.price}
            onChangeText={textChangeHandler.bind(this, 'price')}
            keyboardType='decimal-pad'
            required
            />
        </View>
        )}
        <View style={styles.formControl}>
            <Text style={styles.label}>Description</Text>
            <TextInput
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={textChangeHandler.bind(this, 'description')}
            required
            />
        </View>
    </View>
    </ScrollView>
    );
};

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Add' iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'} onPress={submitFn} />
            </HeaderButtons>
        )};
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});

export default EditProductScreen;
