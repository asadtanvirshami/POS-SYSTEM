import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons' 

import API from '../../../../apis/index.json'

const OrderInfo = ({orderItem,setItemInfoVisible,items,updateCustomesOrdersList}) => {

    const[loading,setLoading] = useState(false)

    useEffect(() => {
     console.log('---orderItem---',orderItem)
    }, [])
    
    const declineAlert = () =>
    Alert.alert('Decline Order', 'Are you sure that you want to decline the order?', [
      {
        text: 'Cancel',
        onPress: () => setItemInfoVisible(false),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => setItemInfoVisible(false)},
    ]);

   const updateOrderStatus=(id)=>{
    setLoading(true)
     axios.post(API.UpdateOrderStatus,{id:id}).then((r)=>{
      if(r.status===200){
        updateCustomesOrdersList(id)
        setLoading(false)
        setItemInfoVisible(false)
      }
     })

   }

  return (
    <View>
      <View style={{flexDirection:'row',alignSelf:'center'}}>
        <Text style={{fontSize:22,color:'#1A6DBB',fontWeight:'600'}}>Order Info</Text>
        <View style={{margin:5}}></View>
        <Icon style={{fontSize:36, color:'#1A6DBB'}} name='cart'/>
      </View>
      <View style={{marginTop:20}}>
        <View style={{marginBottom:10}}><Text style={{fontSize:19,color:'black',textAlign:'left'}}>Customer Info</Text></View>
        <View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Customer Name:</Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.User.f_name} {orderItem.User.l_name}</Text>
            </View>
        </View>
        <></>
        <View style={{marginTop:20, marginBottom:10}}><Text style={{fontSize:19,color:'black',textAlign:'left'}}>Product Info</Text></View>
        <View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Product Name:</Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.ShopItem.name}</Text>
            </View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Product Unit: </Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.ShopItem.units}</Text>
            </View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Product Quantity: </Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.quantity}</Text>
            </View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Total Price:</Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.total_price}</Text>
            </View>
            <View style={{margin:5,flexDirection:'row', alignSelf:'center', marginTop:30}}>
             {loading?
            <TouchableOpacity style={styles.accept_btn}>
              <ActivityIndicator size='small' color='white' style={{color:'white', alignSelf:'center'}}/>
            </TouchableOpacity>:  
             <TouchableOpacity style={styles.accept_btn}>
                <Text style={{fontSize:16,color:'white',fontWeight:'600'}} onPress={()=>{updateOrderStatus(orderItem.id)}}>Accept Order</Text>
              </TouchableOpacity>
              }
              <TouchableOpacity style={styles.decline_btn}>
              <Text style={{fontSize:16,color:'white',fontWeight:'600'}} onPress={()=>{declineAlert()}}>Decline Order</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  )
}

export default OrderInfo

const styles = StyleSheet.create({
  accept_btn:{
    backgroundColor:'#1A6DBB',
    padding:10,
    borderRadius:30,
    marginRight:10,
    width:'39%'
  },
  decline_btn:{
    backgroundColor:'#d9142e',
    padding:10,
    borderRadius:30,
    marginLeft:10
  },
    image:{
        borderRadius:10,
        height:60,
        width:60
    }
})