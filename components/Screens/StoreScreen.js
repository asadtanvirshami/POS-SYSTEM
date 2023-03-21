import { StyleSheet, Text, View, Alert, ActivityIndicator, ScrollView ,TextInput, TouchableOpacity,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown'
import React, { useEffect, useState } from 'react';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import axios from 'axios';

import API from '../../apis/index.json';
import Types from '../../mock/storeTypes.json'

const StoreScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [close, setClose] = useState('');
  const [open, setOpen] = useState('');
  
  const [selectedImage, setSelectedImage] = useState('');
  const [mapScreen, setMapScreen] = useState(false);
  const [load, setLoad] = useState(false);
  const [type, setType] = useState(false);
  const [categories, setCategories] = useState([{check:false}]);

  useEffect(()=>{getcategories()},[])

  async function getcategories(){
    setLoad(true)
    await axios.get(API.GetAllParentChilCategories).then((x)=>{
      let tempState = [];
      x.data.forEach(y => {
        tempState.push({...y, check:false})
      });
      setCategories(tempState)
      setLoad(false)
    })
  }

  const UploadOrCapture = React.useCallback(async(options) => {
    const images = await launchCamera(options);
    const data = new FormData(); 
    data.append('file', {
      uri:images.assets[0].uri,
      type:images.assets[0].type,
      name:images.assets[0].fileName,
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
  }, []);

  const handleSubmit = async() => {
    
    let coords = await AsyncStorage.getItem("@coords")
    let id = await AsyncStorage.getItem("@vendor_id")

    if(name.length>5 && address.length>5 && type!='' && open.length>1 && close.length>1){
      setLoad(true);
      let tempCats = [];
      categories.forEach((x)=>{
        if(x.check==true){
          tempCats.push({id:x.id, name:x.name});
        }
      })
      console.log('categories', tempCats)
      console.log('id', id)
      setTimeout(
        async function() {
        await axios.post(API.CreateShop, {
            country:"Test",
            city:"Test",
            opening:`${open}am`,
            closing:`${close}pm`,
            address:address,
            name:name,
            type:type,
            long:JSON.parse(coords)[0],
            lat:JSON.parse(coords)[1],
            ShopUserId:id,
            categories:tempCats,
            active:1,
            shop_img:selectedImage
        })
          .then(async(x)=>{
            if(x.data.status=='error'){
              setLoad(false);
            }else if(x.data.status=='success'){
                await AsyncStorage.setItem('@store_categories', JSON.stringify(x.data.result))
                navigation.navigate("Login")
              setLoad(false);
            }
          })
      }, 3000);
    }
    
    if(name.length<6){
      Alert.alert("Invalid Name","Please Enter a valid Name");
      return;
    }
    if(address.length<6){
      Alert.alert("Invalid Address","Please Enter a valid Address");
      return;
    }
    if(type == ''){
        Alert.alert("Type Error","Please Enter a valid Type");
        return;
    }
    if(open.length<2){
      Alert.alert("Invalid Timing","Please Enter a Opening timing");
      return;
    }
    if(close.length<2){
      Alert.alert("Invalid Timing","Please Enter a Closing timing");
      return;
    }
  }

  const login = () => {
    setLoad(true);
    console.log(email);
    console.log(code);
    if(code.length>5){
      setTimeout(
        async function() {
          await axios.post(API.GetAccountVerification,{ email:email, pass:code, type:"shopowner"})
          .then((x)=>{
            console.log(x.data);
            if(x.data.message=='Invalid'){
              setLoad(false);
              Alert.alert("Please Try Again","Please Enter the 6 Digit Code recieved on E-mail Correctly!");
            }else if(x.data.message=='Success'){
              setValues(x.data.token);
            }
          })
      }, 3000);
    }
    if(code.length<6){
      Alert.alert("Error","Please Enter the 6 Digit Code recieved on E-mail Correctly!");
      setLoad(false);
    }
  }

  return (
    <View style={{flex:1, paddingLeft:40, paddingRight:40, paddingTop:50, backgroundColor:'white'}}>
      {!load &&
      <View style={{paddingBottom:30}}>
        <ScrollView>
            {/* Login Form */}
        {!mapScreen && 
        <>  
          <Text style={{fontSize:40, fontWeight:'bold', color:'#101111' }}>Create Store</Text>
          <Text style={styles.label}>Store Name</Text>
          <TextInput style={[styles.input]} value={name} placeholder='Name' onChangeText={(x)=>setName(x)} />

          <Text style={styles.label}>Address</Text>
          <TextInput style={[styles.input]} value={address} placeholder='Address' onChangeText={(x)=>setAddress(x)} />
        
          <Text style={styles.label}>Upload Store Image</Text>
          <View style={{height:200}}>
          <Image resizeMode='cover' style={styles.img} source={selectedImage?{uri:selectedImage}:require("../../assets/images/iconpngs/store_2.png")} />
          </View>
          <TouchableOpacity onPress={()=>UploadOrCapture()} style={[styles.btn,{paddingRight:10,paddingLeft:10}]}>
          <Text style={{color:'white',fontSize:14}}>Open Camera</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Type {selectedImage}</Text>
          <SelectDropdown
             buttonStyle={styles.input}
              data={Types}
              onSelect={setType}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                return item
              }}
            />

          <Text style={styles.label}>Select Product's Categories</Text>
          {
            categories.map((x, index)=>{
              return(
                <View style={{flexDirection:'row'}} key={index}>
                  <CheckBox
                    disabled={false}
                    value={x.check}
                    onValueChange={() => {
                      let tempData = [...categories];
                      tempData[index].check=!tempData[index].check
                      setCategories(tempData)
                    }}
                  />
                  <Text style={{marginTop:'1.8%'}}>{x.name}</Text>
                </View>
              )
            })
          }
          <Text style={styles.label}>Opening</Text>
          <TextInput style={[styles.input]} keyboardType='number-pad' value={open} placeholder='11:00 am' onChangeText={(x)=>setOpen(x)} />
          
          <Text style={styles.label}>Closing</Text>
          <TextInput style={[styles.input]} keyboardType='number-pad' value={close} placeholder='11:00 pm' onChangeText={(x)=>setClose(x)} />

          <TouchableOpacity onPress={()=>handleSubmit()}><Text style={[styles.btn,{ marginTop:20 }]}>Submit</Text></TouchableOpacity>
        </>
        }
        {/* Code Form */}
        {mapScreen &&
        <>
          <Text style={{fontSize:30, fontWeight:'bold', color:'#171111', marginTop:100}}>Enter Code </Text>
          <Text style={{fontWeight:'normal', color:'grey', marginBottom:0, marginBottom:6, marginTop:0 }}>
            Enter The Code Recieved On Your Email
          </Text>
          <View style={{marginTop:10, flexDirection:'row'}}>
            <Text>Didn't Recieved The Code Yet? </Text>
            <TouchableOpacity onPress={()=>{setCodeScreen(false)}}>
              <Text style={{color:'#1A6DBB', fontWeight:'bold'}}>
                Try Again
              </Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>login()}><Text style={[styles.btn]}>Submit</Text></TouchableOpacity>
        </>
        }
        </ScrollView>
      </View>
      }
      {load &&
        <View style={{alignItems:'center', marginTop:300}}>
          <ActivityIndicator size={'large'} color={'#1A6DBB'} />
          <Text>Please Wait</Text>
        </View>
      }
    </View>
  )
}

export default StoreScreen

const styles = StyleSheet.create({
    input: {
      marginLeft:5,
      marginRight:5,
      fontSize:17,
      height: 60,
      borderRadius:10,
      borderColor:'white',
      borderWidth: 1,
      paddingLeft:20,
      backgroundColor:'white',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 5,
    },
    btn:{
      marginTop:10,
      fontSize:16,
      color:'white',
      fontWeight:'bold',
      backgroundColor:'#1A6DBB',
      paddingTop:10,
      paddingBottom:10,
      paddingLeft:45,
      paddingRight:45,
      borderRadius:40,
      alignSelf:'flex-end'
    },
    btnMap:{
      marginTop:10,
      fontSize:16,
      color:'white',
      fontWeight:'bold',
      backgroundColor:'#1A6DBB',
      textAlign:'center',
      paddingTop:10,
      paddingBottom:10,
      paddingLeft:45,
      paddingRight:45,
      borderRadius:40,
    },
    label:{
        fontWeight:'normal', color:'grey', marginBottom:6, marginTop:10
    },
    img:{
      borderRadius:10,
      alignItems:'center',
      width:"100%",
      height:'100%'
    }
})