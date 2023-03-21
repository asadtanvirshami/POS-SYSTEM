import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import React,{useState, useEffect} from 'react';
import axios from 'axios';

import Dashboard from './Dashboard';
import API from '../../../apis/index.json';

const HomeScreen = ({navigation}) => {

    const [connection, setConnection] = useState(false);
    const [load, setLoad] = useState(true);
    const [hasStore, setHasStore] = useState(false);

    useEffect(() => { findStore() }, [connection]);

    NetInfo.fetch().then(state => {
        //console.log("Connection type", state.type);
        //console.log("Is connected?", state.isConnected);
        if(state.isConnected){
            setConnection(true);
        }
    });

    async function findStore(){
        let id = await AsyncStorage.getItem("@vendor_id");
        let shopId = await AsyncStorage.getItem("@shop_id");
        // let categories = await AsyncStorage.getItem("@store_categories");
        // console.log(id,shopId,categories)
        //console.log('vendor ID', id)
        // console.log('categories', JSON.parse(categories))
        if(shopId==null){
            if(connection){
                await axios.get(API.GetVendorShop, {
                    headers:{ 'id':`${id}` }
                }).then(async(x)=>{
                    console.log('DAATAA=====',x.data)
                    if(x.data.resultOne==null){
                        setHasStore(false);
                    }else{
                        //AsyncStorage.setItem('@shop_categories',JSON.stringify(x.data.result.ShopCategories));
                        await AsyncStorage.setItem('@shop_id',x.data.resultOne.id);
                        await AsyncStorage.setItem('@store_categories', JSON.stringify(x.data.resultTwo))
                        setHasStore(true);
                    }
                })
            }else{
                setHasStore(false);
            }
        } else {
            await axios
            .get(API.GetVendorShopDetails,{headers:{id:id}})
            .then(async(r)=>{
                if(r.data.message == 'success'){
                     await AsyncStorage.setItem('@shop_name', 
                     JSON.stringify(r.data.payload[0].name))  
                     await AsyncStorage.setItem('@shop_img', 
                     JSON.stringify(r.data.payload[0].ShopImage))  
                }
            })
            setHasStore(true);
        }
        setLoad(false);

        // await axios.get(API.GetVendorShop,{
        //     headers:{ 'id':`${id}` }
        // }).then((x)=>{
        //     if(x.data.result==null){
        //         setHasStore(false);
        //     }else{
        //         AsyncStorage.setItem('@shop_id',x.data.result.id);
        //         AsyncStorage.setItem('@shop_categories',JSON.stringify(x.data.result.ShopCategories));
        //         setHasStore(true);
        //     }
        //     setLoad(false);
        // })
    }

  return (
    <>
    {load &&
    <View style={{flex:1, justifyContent:'center'}}>
      <ActivityIndicator color={'#1A6DBB'} size={'large'} /><Text style={{textAlign:'center'}}>Please Wait...</Text>
    </View>
    }
    {!load &&
    <>
    {hasStore && <Dashboard navigation={navigation}/>}
    {(!hasStore && connection) && 
    <>
        <View style={{flex:1, alignItems:'center', backgroundColor:'white'}}>
            <Image style={{height:90, width:100, marginBottom:20, marginTop:70}} source={require('../../../assets/images/iconpngs/signals.bmp')} />
            <Image style={styles.stretch} source={require('../../../assets/images/iconpngs/store.png')} />
            <Text style={{color:'#0e0e0e', fontSize:25, fontWeight:'bold', marginTop:50}}>Set Up Store</Text>
            <View style={{width:'70%'}}>
                <Text style={{textAlign:'center', marginTop:15, lineHeight:25}}>
                    Make Sure You're connected to the Internet When creating or finding yout Store
                </Text>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('MapsScreen')}><Text style={styles.btn}>Create</Text></TouchableOpacity>
        </View>
    </>
    }
    {(!hasStore && !connection) && 
    <>
        <View style={{flex:1, alignItems:'center', backgroundColor:'white'}}>
            <Image style={{height:90, width:100, marginBottom:20, marginTop:70}} source={require('../../../assets/images/iconpngs/signals.bmp')} />
            <Image style={styles.stretch} source={require('../../../assets/images/iconpngs/store.png')} />
            <Text style={{color:'#0e0e0e', fontSize:25, fontWeight:'bold', marginTop:50}}>Restore Internet Connection</Text>
            <View style={{width:'70%'}}>
                <Text style={{textAlign:'center', marginTop:15, lineHeight:25}}>
                    Make Sure You're connected to the Internet When creating or finding your Store
                </Text>
            </View>
        </View>
    </>
    }
    </>
    }
    </>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
    stretch: {
        width:'60%',
        height:'20%',
        resizeMode: 'stretch',
        opacity:0.9
    },
    btn:{
        backgroundColor:'#1A6DBB',
        textAlign:'center',
        borderRadius:30,
        color:'white',
        fontWeight:'500',
        fontSize:18,
        padding:12,
        paddingLeft:60,
        paddingRight:60,
        margin:25,
    }
})