import React,{useEffect,useState} from 'react'
import { StyleSheet, Text, View, ScrollView,TouchableOpacity,Image } from 'react-native'

import Cancel from 'react-native-vector-icons/AntDesign'

import MMKV from '../../functions/mmks';
import Header from '../Shared/Header'

import { useMMKVStorage } from "react-native-mmkv-storage";

const ReStock = ({navigation}) => {
  const name = 'Re-Stock'
  const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);  
  
  //  useEffect(() => {
  //  let tempState = []
  //  myInventory.forEach((x,index)=>{
  //    tempState.push({...x})
  //    console.log('=========>TempState',tempState)
  //  })
  //  setRestock(tempState)
  // // tempState.forEach((x,index)=>{
  // //   if(x.qty<=10){
  // //     x.Restock_alert = true
  // //   }
  // // })
  // }, [])

  const deletNotification =(x)=>{
    let tempState = [...myInventory]
    tempState.forEach((y,index)=>{
      if(y.ItemId == x.ItemId){
        x.Restock_alert = false
      }
    })
    setMyInventory(tempState)
  }

  return (
    <>
    <Header navigation={navigation} name={name}/>
    <View style={{flex:1,backgroundColor:'white'}}>
      <ScrollView>
        {myInventory.map((x,index)=>{
          return(
          <View key={index}>
          {x.Restock_alert==true&&<View style={styles.content}>
            <View style={{width:200, flexDirection:'row'}}>
            <Image source={{ uri:x.image }} style={styles.image}/>
            <View style={{padding:10 ,maxWidth:300}}>
            <Text style={{fontWeight:'bold', fontSize:15}}>{x.name}</Text>
            <Text style={styles.price}>{x.qty} pieces left</Text>
            <Text>re-order urgently</Text>
            </View>
            </View>
          <View style={{alignSelf:'center'}}>
            <TouchableOpacity 
              onPress={()=>{(deletNotification(x))}}
              style={{alignSelf:'flex-end', marginBottom:10, bottom:15,left:10}}>
              <Cancel name='close' style={{fontSize:19}}/>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={()=>{navigation.navigate('MyInventory')}}
              style={{
                backgroundColor:'#1A6DBB', paddingLeft:23, paddingRight:23,
                borderRadius:25, paddingBottom:3, paddingTop:3
                }}>
              <Text style={{color:'white'}}>Re-stock</Text>
            </TouchableOpacity>
          </View>
        </View>}
        </View>
        )})}
      </ScrollView>
    </View>
    </>
  )
}

export default ReStock

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft:20,
    paddingRight:20,
    paddingTop:15,
    paddingBottom:15,
    borderBottomColor:'silver',
    borderBottomWidth:1,
    backgroundColor:'white'
  },
  image:{
    height:70,
    width:70,
    margin:5,
    borderRadius:5,
    borderWidth:1,
    borderColor:'silver'
  },
  price:{
    color:'red',
    fontSize:14,
    fontWeight:'600'
  }
})