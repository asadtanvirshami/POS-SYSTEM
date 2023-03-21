import { Text, View, TouchableOpacity } from 'react-native';
import { useMMKVStorage } from "react-native-mmkv-storage";
import MMKV from '../../functions/mmks';
import React from "react";

const Records = ({navigation}) => {
    const [myRecords, setMyRecords] = useMMKVStorage("sales", MMKV,[]);


    return (
    <>
    {(myRecords.length!=0) &&
    <View style={{
        backgroundColor:'white', position:'absolute', bottom:0, width:'100%', alignItems:'center',
        borderColor:'silver', borderWidth:1, borderTopLeftRadius:20,borderTopRightRadius:20, height:90, zIndex:0
      }}>
      <TouchableOpacity style={{
          backgroundColor:'#5E9CD7', height:50, borderRadius:30, marginTop:20, width:'90%',
          paddingLeft:10, paddingRight:10, paddingTop:7, flexDirection:'row', justifyContent:'space-between'
        }}>
      
        <View style={{
          backgroundColor:'white', width:35, height:35, alignContent:'center',
          alignItems:'center', justifyContent:'center', borderRadius:25
          }}>
          <Text style={{backgroundColor:'white'}}>{mySales.length}</Text>
        </View>
        <View style={{
          width:70, height:35, alignContent:'center',
          alignItems:'center', justifyContent:'center',
          }}><Text>View Cart</Text>
        </View>
        <View style={{
          width:50, height:35, alignContent:'center',
          alignItems:'center', justifyContent:'center',
          }}>
        </View>
      
      </TouchableOpacity>
    </View>
    }
    </>
  )
}

export default Records

const styles = StyleSheet.create({})