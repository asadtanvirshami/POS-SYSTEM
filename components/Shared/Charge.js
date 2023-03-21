import React from "react";
import MMKV from '../../functions/mmks';
import { useMMKVStorage } from "react-native-mmkv-storage";
import { Text,View,TouchableOpacity} from 'react-native'

const Charge = ({navigation, length}) => {
    const [charge, setCharge] = useMMKVStorage("charge", MMKV,[]);

    return (
    <>
    {charge.length>0 &&
    <View style={{
        backgroundColor:'white', position:'absolute', bottom:0, width:'100%', alignItems:'center',
        borderColor:'silver', borderWidth:1, borderTopLeftRadius:20,borderTopRightRadius:20, height:90, zIndex:0
      }}>
      <TouchableOpacity style={{
          backgroundColor:'#5E9CD7', height:50, borderRadius:30, marginTop:20, width:'90%',
          paddingLeft:10, paddingRight:10, paddingTop:7, flexDirection:'row', justifyContent:'space-between'
        }} 
        onPress={() => navigation.navigate('Charge')}
      >
      
        <View style={{
          backgroundColor:'white', width:35, height:35, alignContent:'center',
          alignItems:'center', justifyContent:'center', borderRadius:25
          }}>
          <Text style={{backgroundColor:'white'}}>{charge.length}</Text>
        </View>
        <View style={{
          width:70, height:35, alignContent:'center',
          alignItems:'center', justifyContent:'center',
          }}><Text>Charge</Text>
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
export default Charge

