import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Platform, Alert, ActivityIndicator, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { Image } from 'react-native-elements';

import Colors from '../../constants/Color';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const firebaseConfig = {
    apiKey: "AIzaSyDx7qy1h9IyWbmAC_qX6bjeDPAK1vLtPVA",
    authDomain: "shopapp-8a6fd.firebaseapp.com",
    databaseURL: "https://shopapp-8a6fd.firebaseio.com",
    projectId: "shopapp-8a6fd",
    storageBucket: "shopapp-8a6fd.appspot.com",
    messagingSenderId: "571587559134",
    appId: "1:571587559134:web:e429e7c4878148a9100c4f",
    measurementId: "G-RYPX19C7L2"
  };
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [pickerResult, setPickerResult] = useState();

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

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error, [{text: 'OK'}]);
        }
    }, [error]);

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!','Please input a field.', [{text: 'OK'}]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                await dispatch(
                    productsActions.updateProduct(
                        prodId, 
                        formState.inputValues.title, 
                        formState.inputValues.description, 
                        formState.inputValues.imageUrl
                    )
                );
            } else {
                await dispatch(
                    productsActions.createProduct(
                        formState.inputValues.title, 
                        formState.inputValues.description, 
                        formState.inputValues.imageUrl, 
                        +formState.inputValues.price
                    )
                );
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, prodId,  formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const getRandomString = (length) => {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
    
    const _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
    
        if (!result.cancelled) {
            uploadImage(result.uri, getRandomString(20))
                .then(() => {
                    console.log('it work')
                })
                .catch(error => {
                    console.log('it does not work')
                    console.error(error)
                })
        }
    }
    
    const  uploadImage = async (uri, imageName) => {
          const response = await fetch(uri);
          const blob = await response.blob();
    
          const ref = firebase.storage().ref().child(`${imageName}`);

          ref.put(blob).then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {
                textChangeHandler('imageUrl', url);
            })
          })
      }

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

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primaryColor} />
            </View>
        )
    }

    return (
    <ScrollView>
        <View style={styles.form}>
        <View style={styles.formControl}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                id='title'
                style={styles.input}
                value={formState.inputValues.title}
                onChangeText={textChangeHandler.bind(this, 'title')}
                keyboardType='default'
                autoCapitalize='sentences'
                autoCorrect
                returnKeyType='next'
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
        <View style={styles.formControl, styles.image}>
            {/* <Text style={styles.label}>Image URL</Text>
            <TextInput
            style={styles.input}
            value={formState.inputValues.imageUrl}
            onChangeText={textChangeHandler.bind(this, 'imageUrl')}
            required
            /> */}
            <Button onPress={_pickImage} title="Choose Image" />
            {formState.inputValues.imageUrl
            ? <Image
                source={{uri: formState.inputValues.imageUrl}}
                style={{ width: 300, height: 250 }}
                PlaceholderContent={<ActivityIndicator size='large' color={Colors.primaryColor} />}
                />
            : null}
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
  },
  centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1'
  },
});

export default EditProductScreen;
