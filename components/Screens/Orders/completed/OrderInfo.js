import React,{useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons' 

const OrderInfo = ({orderItem}) => {

    useEffect(() => {
     console.log('---orderItem---',orderItem)
    }, [])
    

  return (
    <View>
      <View style={{flexDirection:'row',alignSelf:'center'}}>
        <Text style={{fontSize:22,color:'#1A6DBB',fontWeight:'600'}}>Order Completed</Text>
        <View style={{margin:5}}></View>
        <Icon style={{fontSize:36, color:'lightgreen'}} name='check'/>
      </View>
      <View style={{marginTop:20}}>
        <View style={{marginBottom:10}}><Text style={{fontSize:19,color:'black',textAlign:'left'}}>Customer Info</Text></View>
        <View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Customer Name:</Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.User.f_name} {orderItem.User.l_name}</Text>
            </View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Order Date:</Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.User.createdAt.slice(0,15)}</Text>
            </View>
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Confirm Date: </Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.User.createdAt.slice(0,15)}</Text>
            </View>
        </View>
        <></>
        <View style={{marginTop:10, marginBottom:10}}><Text style={{fontSize:19,color:'black',textAlign:'left'}}>Product Info</Text></View>
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
            <View style={{margin:5,flexDirection:'row'}}>
              <Text style={{fontSize:16,color:'black'}}>Order Date:</Text>
              <Text style={{color:'gray',paddingLeft:10,fontSize:16}}>{orderItem.ShopItem.createdAt.slice(0,15)}</Text>
            </View>
        </View>
      </View>
    </View>
  )
}

export default OrderInfo

const styles = StyleSheet.create({
    image:{
        borderRadius:10,
        height:60,
        width:60
    }
})