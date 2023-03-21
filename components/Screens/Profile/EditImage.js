import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';

import API from '../../../apis/index.json';

const EditImage = ({ setEditImageModal, setEditImage }) => {
    const [selectedImage, setSelectedImage] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handelClick = async () => {
        setIsLoading(true)
        const id = await AsyncStorage.getItem('@vendor_id');
        axios.post(API.UpdateVendorShop, {
            id: id,
            shop_image: selectedImage,
        })
        .then((r) => {
            if (r.data.message == 'success') {
                Alert.alert('Success', 'Store details succesfully updated!')
                setIsLoading(false)
            }
        })
    };

    const UploadOrCapture = React.useCallback(async (options) => {
        const images = await launchCamera(options);
        const data = new FormData();
        data.append('file', {
            uri: images.assets[0].uri,
            type: images.assets[0].type,
            name: images.assets[0].fileName,
        });
        data.append('upload_preset', 'Innovatory');
        data.append('cloud_name', 'dt9hdorau');
        await fetch('https://api.cloudinary.com/v1_1/dt9hdorau/image/upload', {
            method: 'post',
            body: data,
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.url);
                setSelectedImage(data.url)
            })
            .catch(err => {
                console.log(err);
            });
    }, [selectedImage]);

    return (
        <View style={{ margin: 10 }}>
            <Text style={{ color: '#1A6DBB', fontSize: 18, textAlign: 'left' }}>
                Edit Store Image
            </Text>
            <View style={{ marginTop: 10 }}>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: 'black', fontSize: 16, textAlign: 'left' }}>
                        Change Image
                    </Text>
                </View>
                <View style={{ alignSelf: "center" }}>
                    <Image resizeMode='cover' style={styles.img} source={selectedImage ? { uri: selectedImage } : require("../../../assets/images/iconpngs/store_2.png")} />
                </View>
                <TouchableOpacity style={styles.buttonSave}
                    onPress={() => { UploadOrCapture() }}
                >
                    <Text style={{ color: 'white' }}>Upload Image</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonSave]}
                    onPress={() => {
                        handelClick()
                    }}>
                    {isLoading ? (
                        <Text style={{ alignSelf: 'center' }}>
                            <ActivityIndicator size={'small'} color={'white'} />
                        </Text>
                    ) : (
                        <Text style={{ textAlign: 'center', color: 'white' }}>
                            Save Changes
                        </Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonSave]}
                    onPress={() => {
                        setEditImage(false), setEditImageModal(false);
                    }}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditImage;

const styles = StyleSheet.create({
    buttonSave: {
        color: 'white',
        backgroundColor: '#1A6DBB',
        borderRadius: 12,
        padding: 10,
        margin: 3,
        width: 110,
        alignSelf: 'center',
        marginTop: 15,
    },
    input_field: {
        borderWidth: 1,
        borderColor: 'silver',
        padding: 6,
        width: 300,
        borderRadius: 12,
    },
    img_btn: {
        backgroundColor: "#1A6DBB",
        padding: 5,
        borderRadius: 10
    }
});
