import React, { useState } from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
import {getDistance} from 'geolib';

import Colors from '../constants/Color';
import MapPreview from './MapPreview';

const LocationPicker = props => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  // const verifyPermissions = async () => {
  //   const result = await Permissions.askAsync(Permissions.LOCATION);
  //   if (result.status !== 'granted') {
  //     Alert.alert(
  //       'Insufficient permissions!',
  //       'You need to grant location permissions to use this app.',
  //       [{ text: 'Okay' }]
  //     );
  //     return false;
  //   }
  //   return true;
  // };

  const getLocationHandler = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync(); 
      await setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000
      });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
      await calculateDistance(location.coords.latitude, location.coords.longitude)
    } catch (err) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
    }

    await setIsFetching(false);
  };

  const calculateDistance = async (lat, lng) => {
    try {
      var dis = getDistance(
        {latitude: lat, longitude: lng},
        {latitude: 10.755952474737242, longitude: 106.66266841132723},
      );
      alert(
        `Distance\n\n${dis / 1000} KM \n\n Shipping fee ${Math.ceil(dis / 1000 * 5000 / 1000/23)}$`
      );
    }
    catch (err) {
      console.log("Error")
    }
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview style={styles.mapPreview} location={pickedLocation}>
        {isFetching ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text>No location chosen yet!</Text>
        )}
      </MapPreview>
      <Button
        title="Get User Location"
        color={Colors.primary}
        onPress={getLocationHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1
  }
});

export default LocationPicker;
