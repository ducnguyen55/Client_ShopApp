import React, { Component } from 'react';
import { Button, Image, Text, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';

// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
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


export default class App extends Component {
  state = {
    pickerResult: null,
  };

  // _pickImg = async () => {
  //   let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //     base64: true
  //   });
  //   this.setState({
  //     pickerResult,
  //   });
  //   if (!pickerResult.cancelled) {
  //     this.uploadImage(pickerResult.base64)
  //       .then(() => {
  //         Alert.alert("Success");
  //       })
  //       .catch((error) => {
  //         Alert.alert(error);
  //       });
  //   }
  // };

  // _pickImg = async () => {
  //   let pickerResult = await ImagePicker.launchImageLibraryAsync();
  //   console.log(pickerResult);
  //   if (!pickerResult.cancelled) {
  //     this.uploadImage(pickerResult)
  //       .then(() => {
  //         Alert.alert("Success");
  //       })
  //       .catch((error) => {
  //         Alert.alert(error);
  //       });
  //   }
  // };

  // uploadImage = async (uri) => {

  //   const response = await fetch(`https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5&action=upload&fileuri=${uri}&format=json`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   const resData = await response.json();
  //   console.log(resData);
  // }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
    });

    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomId = '';
    for ( var i = 0; i < 21; i++ ) {
      randomId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    if (!result.cancelled) {
        this.uploadImage(result.uri, randomId)
            .then(() => {
                console.log('it work')
            })
            .catch(error => {
                console.log('it does not work')
                console.error(error)
            })
    }
};

  uploadImage = async (uri, imageName) => {
      const response = await fetch(uri);
      const blob = await response.blob();

      const ref = firebase.storage().ref().child(`${imageName}`);
      // const url = await ref.getDownloadURL();
      // this.setState({
      //   pickerResult: url,
      // });
      ref.put(blob).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          console.log(' * new url', url)
        })
      })
  }
  
  render() {
    let { pickerResult } = this.state;
    let imageUri = pickerResult;

    return (
      <View style={styles.container}>
        <Button onPress={this._pickImage} title="Open Picker" />
        {pickerResult
          ? <Image
              source={{uri: imageUri}}
              style={{ width: 300, height: 250 }}
            />
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
