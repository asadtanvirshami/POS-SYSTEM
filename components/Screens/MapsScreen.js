import Geolocation from 'react-native-geolocation-service';
import { StyleSheet, View, PermissionsAndroid, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoiYWJkdWxsYWh0ZWFtaGFpbCIsImEiOiJjbDdvbGtucjEwNm91M3ZueGZwaTEwcDg4In0.Be48QvgVjJ5-MNt3pzEnfw');

const MapsScreen = ({navigation}) => {

    let annotationRef = useRef(null);
    const [coordinates, setCoordinates] = useState([8.674252499999994, 9.0845755]);
    useEffect(() => {
        console.log('Page Hit')
        requestLocationPermission()
    }, [])

    async function requestLocationPermission() {
        const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
            alert("You've access for the location");
        } else {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Cool Location App required Location permission',
                        'message': 'We required Location permission in order to get device location ' +
                            'Please grant us.'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //alert("You've access for the location");
                    getLocation()
                } else {
                    alert("You don't have access for the location");
                }
            } catch (err) {
                alert(err)
            }
        }
    };

    async function getLocation () {
        Geolocation.getCurrentPosition(
            (position) => {
              console.log(position.coords.latitude);
              console.log(position.coords.longitude);
              setCoordinates([position.coords.longitude, position.coords.latitude])
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}
            onPress={(feature)=>{
                console.log(feature.geometry.coordinates)
                console.log(feature.geometry.coordinates[0])
                setCoordinates(feature.geometry.coordinates)
            }}
          >
            <MapboxGL.Camera zoomLevel={17}centerCoordinate={coordinates} />
            <MapboxGL.PointAnnotation coordinate={coordinates} />
           </MapboxGL.MapView>
           <View style={styles.bottomView}>
            <Text style={{color:'#10100f', fontWeight:'bold', marginBottom:10, fontSize:16}}>Is This Your Location?</Text>
            <Text style={{color:'grey'}}>Tap At The Point On Map Where Location is Most Accurate</Text>
            <TouchableOpacity onPress={async()=>{
                try {
                    await AsyncStorage.setItem('@coords', JSON.stringify(coordinates))
                    navigation.navigate("StoreScreen")
                } catch (error) {
                    
                }
            }}>
                <Text style={styles.btn}>Confirm</Text>
            </TouchableOpacity>
            </View>
           </View>
         </View>
    );
 }
export default MapsScreen;

const styles = StyleSheet.create({
    page: {
      flex: 1,
    },
    container: {
      height: "100%",
      width: "100%",
      flex: 1,
    },
    map: {
      flex: 1,
    },
    annotationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    annotationFill: {
        width: 45 - 3,
        height: 45 - 3,
        borderRadius: (45 - 3) / 2,
    },
    bottomView:{
        position:'absolute', backgroundColor:'white',
        paddingTop:30, paddingBottom:20,
        paddingLeft:60, paddingRight:60,
        bottom:0, alignSelf:'center',
        borderTopRightRadius:50,
        borderTopLeftRadius:50,
        shadowColor: "#000",
        shadowOffset: {
            height: 10,
            width: 0,
        },
        shadowOpacity: 0.53,
        shadowRadius: 13.97,
        elevation: 21,
        width:'100%',
    },
    btn:{
        backgroundColor:'#1A6DBB',
        textAlign:'center',
        borderRadius:25,
        color:'white',
        fontSize:18,
        padding:15,
        margin:20,
    }
  });