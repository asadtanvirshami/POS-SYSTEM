import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import axios from 'axios';

import API from '../../../../apis/index.json'

const StoreForm = ({ setEditStore, storeDetails, coordinates, lat, long }) => {
    ;
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [open, setOpen] = useState('');
    const [close, setClose] = useState('');
    const [type, setType] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(storeDetails[0])
        setName(storeDetails[0].name)
        setAddress(storeDetails[0].address)
        setOpen(storeDetails[0].opening)
        setClose(storeDetails[0].closing)
        setType(storeDetails[0].type)
    }, []);

    useEffect(() => {
    let longitude = coordinates.slice(0,1)
    let latitude = coordinates.slice(1,2)
    console.log('===>Long',longitude)
    console.log('===>Laat',latitude)
    }, [long,lat,coordinates])
    

    const handelClick = async () => {
        let longitude = coordinates.slice(0,1)
        let latitude = coordinates.slice(1,2)
        setIsLoading(true)
        axios.post(API.UpdateVendorShop, {
            id: storeDetails[0].id,
            name: name,
            address: address,
            type: type,
            lat: latitude.toString(),
            long: longitude.toString(),
            country: storeDetails[0].country,
            city: storeDetails[0].city,
            closing: close,
            opening: open,
            shop_image: storeDetails[0].shop_image,
            ShopUserId: storeDetails[0].ShopUserId
        })
        .then((r) => {
            if (r.data.message == 'success') {
                Alert.alert('Success', 'Store details succesfully updated!')
                setIsLoading(false)
            }
        })
    };

    return (
        <View>
            <ScrollView>
                <Text style={{ fontSize: 30, fontWeight: '600', margin: 25, color: '#1A6DBB' }}>Edit Store</Text>
                <View style={{ marginTop: 15, alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                              value={name}
                            style={styles.txt_small_input}
                            onChangeText={setName}
                            placeholder="Unit"
                        />
                        <TextInput
                            value={type}
                            style={styles.txt_small_input}
                            onChangeText={setType}
                            placeholder="Label"
                        />
                    </View>
                    <TextInput
                        value={address}
                        style={styles.txt_lng_input}
                        onChangeText={setAddress}
                        placeholder="Address"
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            value={open}
                            style={styles.txt_small_input}
                            onChangeText={setOpen}
                            placeholder="Unit"
                        />
                        <TextInput
                            value={close}
                            style={styles.txt_small_input}
                            onChangeText={setClose}
                            placeholder="Label"
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity style={styles.btn} onPress={() => handelClick()}><Text style={styles.btn_txt}>Save Address</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => setEditStore(false)}><Text style={styles.btn_txt}>Cancel</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default StoreForm

const styles = StyleSheet.create({
    txt_small_input: {
        borderRadius: 8,
        borderColor: '#499ED7',
        backgroundColor: 'white',
        width: 150,
        height: 40,
        paddingLeft: 20,
        paddingTop: 13,
        margin: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1.0,
        elevation: 2,
    },
    txt_lng_input: {
        borderRadius: 8,
        borderColor: '#499ED7',
        backgroundColor: 'white',
        width: 310,
        height: 40,
        paddingLeft: 20,
        paddingTop: 13,
        margin: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1.0,
        elevation: 2,
    },
    input_view: {
        marginTop: 40,
    },
    txt_area_input: {
        borderRadius: 8,
        borderColor: '#499ED7',
        backgroundColor: 'white',
        width: 310,
        height: 100,
        paddingLeft: 20,
        margin: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1.0,
        elevation: 2,
    },
    btn: {
        marginTop: 25,
        margin: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A6DBB',
        borderRadius: 8,
        width: 150,
        height: 35,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1.0,
        elevation: 2,
    },

    btn_txt: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
    },
})