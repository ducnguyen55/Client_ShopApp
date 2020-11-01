import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

// import ENV from '../env';

const MapPreview = props => {
  // let imagePreviewUrl;
  // if (props.location) {
  //   imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${
  //     props.location.lat
  //   },${
  //     props.location.lng
  //   }&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${
  //     props.location.lat
  //   },${props.location.lng}&key=${ENV.googleApiKey}`;
  // }

  return (
    <View style={{ ...styles.mapPreview, ...props.style }}>
      {props.location ? (
        <MapView 
        style={styles.mapStyle}  
        initialRegion={{latitude: props.location.lat, longitude: props.location.lng, latitudeDelta:0.01, longitudeDelta: 0.01}}
        >
            <Marker
              coordinate={{latitude: props.location.lat, longitude: props.location.lng}}
              title={'Home'}
              description={'Home'}
            />
        </MapView> 
      ) : (
        props.children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 250
  },
  mapImage: {
    width: '100%',
    height: '100%'
  },
  mapStyle: {
    width: 300,
    height: 250,
  }
});

export default MapPreview;
