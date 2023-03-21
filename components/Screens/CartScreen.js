import React, { useState,useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useMMKVStorage } from "react-native-mmkv-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import API from './../../apis/index.json';
import MMKV from '../../functions/mmks';

import AntDesign from 'react-native-vector-icons/AntDesign';

const CartScreen = ({navigation}) => {
    const [cart, setCart] = useMMKVStorage("user", MMKV,[]);
    const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);  
    const [data, setData] = useState([]);
    const [singleCount, setSingleCount] = useState([]);

    const [costPrice, setCostPrice] = useState(0);
    const [profit, setProfit] = useState(0);
    
    useEffect(() => {
      calCulation();
    }, [])

    const PostInventory = async()=>{

      let shopId = await AsyncStorage.getItem("@shop_id")
      let tempState = [...cart] // cart arr
      let tempData = [...data] //new arr for db post
      let inventoryData = [...myInventory]
      tempState.forEach((x,index)=>{
        tempData.push({
          id:'',
          price:x.price,
          units:x.units,
          s_price:x.selling_price,
          c_price:x.cost_price,
          qty:x.qty,
          name:x.name,
          ItemId:x.ItemId,
          ShopId:shopId,
          ChildCategoryId:x.ChildCategoryId,
          weight:x.weight,
          image:x.image,
          cartan:x.cartan,
          Restock_alert:false,
          stock:1,
          active:1,
          updatedAt:x.updatedAt,
          createdAt:x.createdAt
        })
        inventoryData.push({
          id:'',
          price:x.price,
          units:x.units,
          s_price:x.selling_price,
          c_price:x.cost_price,
          qty:x.qty,
          name:x.name,
          ItemId:x.ItemId,
          ShopId:shopId,
          ChildCategoryId:x.ChildCategoryId,
          weight:x.weight,
          image:x.image,
          cartan:x.cartan,
          Restock_alert:false,
          stock:1,
          active:1,
          updatedAt:x.updatedAt,
          createdAt:x.createdAt
        })
      }) 
     
      setMyInventory(inventoryData) 
      //console.log('MyInventoryState=========>',inventoryData)
      axios.post(API.PostInventoryInDatabase,tempData).then((response)=>{ })
      setCart() 
      navigation.navigate('Home')
    }
    
    const handleClick=({countType, unitType}, x) => {
        if(countType == '+'  &&  unitType == 'single'){
          let tempState = [...cart];
          tempState.forEach((y, index) => {
              if(y.ItemId==x.ItemId){
                y.qty = y.qty + 1;
              }
          });
          setCart(tempState);
        }
        if(countType == '-'  &&  unitType == 'single'){
          let tempState = [...cart];
          tempState.forEach((y, index) => {
              if(y.qty=='1'){
                tempState.splice(index,1)
                return;
              }
              if(y.ItemId==x.ItemId){
                y.qty = y.qty - 1;
              }
          });
          setCart(tempState);
        }
        calCulation();
    }
    
    const calCulation = () => {
      let tempPrice = 0;
      let tempProfit = 0;
      cart.forEach((x)=>{
        tempPrice = tempPrice + parseFloat(x.cost_price)*parseFloat(x.qty)
        tempProfit = tempProfit + parseFloat(x.selling_price)*parseFloat(x.qty)
      })
      setCostPrice(tempPrice)
      setProfit(tempProfit)
    }

  return (
    <>
    <View style={{flex:1,backgroundColor:"white"}}>
      <View>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity style={{padding:20}} onPress={()=>goBack()}>
          <AntDesign name="close" color={'grey'} style={{fontSize:22}} />
        </TouchableOpacity>
        <Text style={{alignSelf:'center', color:'#1A6DBB', fontSize:20, fontWeight:'500'}}>Purchase List</Text>
        </View>
        <View style={{height:420}}>
        <ScrollView>
        {cart.map((x,index)=>{
          return(
            <View key={index}>
              <View style={Card}>
                <View style={Grid}>
                  <View style={Card.image_view}>
                  <Image style={Card.image}  source={{ uri:x.image }}/>
                  </View>
                  <View style={Card.detail_view}>
                    <Text style={Card.heading}>{x.name}</Text>
                    <Text style={Card.units}>{x.units}</Text>
                    <View style={{marginTop:5}}>
                      <View style={Grid}>
                        <Text>Units: {x.qty} </Text>
                      </View>
                    </View>
                  </View>
                <View style={Card.btn_view}>
                <View style={{flexDirection:'row'}}>
                {singleCount &&
                <View style={Card.stockBtnGrey}>
                <TouchableOpacity style={Card.minusBtn} 
                  onPress={({countType='-',unitType='single'})=>(handleClick({countType,unitType},x))}
                >
                <Text style={{color:'white', fontSize:15}}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Card.plusBtn} 
                    onPress={({countType='+',unitType='single'})=>(handleClick({countType,unitType},x))}
                >
                <Text style={{color:'white', fontSize:15}}>+</Text>
                </TouchableOpacity>
                <Text style={Card.stockUpFont}>{x.qty}</Text>
                </View>
                }
                </View>
                </View>
                </View>
              </View>
            </View>                                                                                 
            )
        })}
        </ScrollView>
        </View>
      </View>
      <View style={{paddingTop:20, paddingBottom:20, paddingLeft:30, paddingRight:30, borderTopColor:'grey', borderTopWidth:1}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
          <Text style={{fontSize:18}}>Cost Price</Text>
          <Text style={{fontSize:18, color:'#045c9f'}}>Rs. {costPrice}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
          <Text style={{fontSize:18}}>Expected Profit</Text>
          <Text style={{fontSize:18, color:'#038638'}}>Rs. {profit-costPrice}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', marginBottom:10, marginTop:20}}>
          <TouchableOpacity onPress={()=>{PostInventory(cart)}}>
            <Text style={{
              backgroundColor:'#1A6DBB', color:'white', fontSize:18,
              paddingLeft:35,paddingRight:35, paddingTop:7, paddingBottom:7, borderRadius:25
              }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </>
  )
}

export default CartScreen

const Grid = StyleSheet.create({flexDirection: 'row'});
const Card = StyleSheet.create({
  borderBottomColor:'silver',borderBottomWidth:1, 
  backgroundColor:'white',padding:15,
  
  image_view: {flex: 2},
  image: {
    alignSelf:'center',
    height:60,
    width:60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'silver',
  },
  detail_view:{flex:4,alignSelf:'center'},
  heading:{fontWeight:'600',color:"#1f1e1d"},
  units:{color:'gray'}, 
  qty:{fontSize:14,color:'#1f1e1d'},
  btn_view:{flex:2, alignSelf:'flex-end'},
  btn:{alignSelf:"center"},
  unit:{ fontWeight:'500'},
  stockBtn:{backgroundColor:'#1A6DBB',
  padding:5,width:90,textAlign:'center',
  color:'white',borderRadius:5},
  stockBtnGrey:{
    backgroundColor:'silver',
    width:80,
    textAlign:'center',
    alignItems:'center',
    borderRadius:25,
    paddingBottom:3,
    paddingTop:3,
    color:'white',
    height:25
  },
  stockUpFont:{color:'#373737', fontWeight:'900'},
  minusBtn:{
    backgroundColor:'#1A6DBB',
    width:32,height:32,
    justifyContent:'center',
    position:'absolute', borderRadius:25,
    left:-10,top:-3,
    textAlign:'center',
    alignItems:'center',
  },
  plusBtn:{
    backgroundColor:'#1A6DBB',
    width:32,height:32,
    justifyContent:'center',
    position:'absolute', borderRadius:25,
    right:-10,top:-3,
    textAlign:'center',
    alignItems:'center',
  },
})
