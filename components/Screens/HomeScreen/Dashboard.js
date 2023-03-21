import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import MMKV from '../../../functions/mmks';
import { useMMKVStorage } from "react-native-mmkv-storage";

import MenuIcon from 'react-native-vector-icons/SimpleLineIcons';
import AddIcon from 'react-native-vector-icons/AntDesign';

import Drawer from "../../Shared/Drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = ({navigation}) => {

    const[drawerState, setDrawerState] = useState(false);

    const[ShopName, setShopName] = useState("");

    //MMKV Storage
    const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);
    const [myRecords, setMyRecords] = useMMKVStorage("sales", MMKV,[]);

    useEffect(() => {
        getVendorDetails()
        let tempState= [...myInventory]
        if(tempState.length===0){return}
    }, [])

    async function getVendorDetails (){
        let shop_name = await AsyncStorage.getItem('@shop_name')
        setShopName(shop_name)
    }
    
  return (
    <>
    <Drawer drawerState={drawerState} navigation={navigation}/>
    <View onTouchStart={()=>setDrawerState(false)} style={{flex:1, marginTop:20, marginLeft:17, marginRight:17}}>
    {/* Header */}
    <View style={{flexDirection:'row', width:'100%', backgroundColor:''}}>
        <TouchableOpacity style={{marginRight:'auto'}} onPress={()=>setDrawerState(true)} >
            <MenuIcon name="menu" size={30} color="grey" />
        </TouchableOpacity>
        <View style={{marginLeft:'auto', marginRight:'auto', width:190}}>
            <Text style={{fontSize:12, fontFamily:'Inter-Light', lineHeight:15}}>Your Shop</Text>
            <Text style={{fontSize:15, fontFamily:'Inter-Medium', lineHeight:16}}>{ShopName}</Text>
        </View>
        <View style={{marginLeft:'auto', width:30}}></View>
    </View>
    <View style={{ marginTop:20, borderBottomColor: 'silver', borderBottomWidth: 1 }} />
    {/* Screen */}
    <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:40}}>
        <TouchableOpacity  onPress={()=>navigation.navigate('Sales')} style={styles.mainScreens}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.mainScreenText}>{myRecords.length}</Text>
                <Text style={{color:'white', fontSize:20, alignSelf:'center'}}></Text>
            </View>
            <Text style={{color:'white', lineHeight:14}}>Sales</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('ReStock')}  style={styles.mainScreens}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.mainScreenText}>{myInventory.filter((x) => {
                return (x.Restock_alert==true)}).length}
                </Text>
                <Text style={{color:'white', fontSize:20, alignSelf:'center'}}></Text>
            </View>
            <Text style={{color:'white', lineHeight:14}}>Re-Stock</Text>
        </TouchableOpacity>
    </View>
    <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:30}}>
        <TouchableOpacity style={styles.mainScreens} onPress={()=>navigation.navigate('Inventory')}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.mainScreenText}>100</Text>
                <Text style={{color:'white', fontSize:20, alignSelf:'center'}}>+</Text>
            </View>
            <Text style={{color:'white', lineHeight:14}}>Global Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainScreens} disabled={drawerState} onPress={()=>navigation.navigate('MyInventory')}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.mainScreenText}>{myInventory.length}</Text>
                <Text style={{color:'white', fontSize:20, alignSelf:'center'}}></Text>
            </View>
            <Text style={{color:'white', lineHeight:14}}>My Inventory</Text>
        </TouchableOpacity>
    </View>
    </View>
    <View style={styles.addButtonView}>
        <TouchableOpacity onPress={()=>navigation.navigate('POS')} style={styles.addButton}>
          <View><AddIcon name='pluscircleo' style={{fontSize:45, color:'#1A6DBB'}}/></View>
        </TouchableOpacity>
      </View>
    </>
  )
}
export default Dashboard
const styles = StyleSheet.create({
    menuFonts:{
        color:'white',
        fontSize:20,
        marginTop:6,
        fontFamily:'Inter-Medium'
    },
    menuIconProfile:{
        marginTop:7,
        marginRight:5,
        fontSize:30,
        color:'white'
    },
    menuIconOrders:{
        marginTop:5,
        marginRight:5,
        fontSize:30,
        color:'white'
    
    },
    menuIconHelpCenter:{
        marginTop:7,
        marginRight:9,
        fontSize:25,
        color:'white'
    
    },
    menuIconSettings:{
        marginTop:7,
        marginRight:9,
        fontSize:25,
        color:'white'
    },
    mainScreens:{
        width:130,
        height:130,
        backgroundColor:'#1A6DBB',
        borderRadius:18,
        justifyContent:'center',
        alignItems:'center',
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity:  0.21,
        shadowRadius: 7.68,
        elevation: 10
    },
    mainScreenText:{
        color:'white',
        fontFamily:'Inter-ExtraBold',
        fontSize:35
    },
    addButtonView:{
        flex:1,
        position:'absolute',
         padding:5,
         flexDirection:'row',
         alignSelf:'flex-end',
         bottom:50,right:15
    },
    addButton:{
        shadowColor:'#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius:3000,
        backgroundColor:"white",
        padding:10,
    }
})
   