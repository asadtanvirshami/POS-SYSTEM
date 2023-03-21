import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';

const Header = ({navigation,name}) => {

  useEffect(() => {
    //console.log(navigation.getState().routes[1].name)
  }, [])

  return (
    <View style={{backgroundColor:'#1A6DBB', flexDirection:'row', paddingTop:15, paddingBottom:10}}>
      <TouchableOpacity style={{marginRight:'auto'}} onPress={()=>navigation.navigate('Home')}>
        <AntDesign name="arrowleft" size={25} color="white" style={{marginLeft:20}} />
      </TouchableOpacity>
        <Text style={{
          marginRight:'auto', marginLeft:'auto', fontFamily:'Inter-Bold', color:'white',
          fontSize:18
          }}>{name}</Text>
        <View style={{marginLeft:'auto', width:45}}></View>
    </View>
  )
}
export default Header