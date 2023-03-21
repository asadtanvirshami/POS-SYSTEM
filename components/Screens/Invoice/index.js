import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Check from 'react-native-vector-icons/AntDesign'

import Header from '../../Shared/Header';

const Invoice = ({ route, navigation}) => {
    const name = 'Invoices'
    const{s_price,day,month,year,user,discount,change_amount,details} = route.params;
  return (
    <>
    <View style={{backgroundColor:'#1A6DBB', flexDirection:'row', paddingTop:15, paddingBottom:10}}>
      <TouchableOpacity style={{marginRight:'auto'}} onPress={() => navigation.goBack()} >
        <AntDesign name="arrowleft" size={25} color="white" style={{marginLeft:20}} />
      </TouchableOpacity>
        <Text style={{
          marginRight:'auto', marginLeft:'auto', fontFamily:'Inter-Bold', color:'white',
          fontSize:18
          }}>{name}</Text>
        <View style={{marginLeft:'auto', width:45}}></View>
    </View>

    <View style={{flex:1, backgroundColor:'white',}}>
  <ScrollView>
     <View >
      <View style={{alignSelf:'center', justifyContent:'center',margin:20,padding:20}}>
       <Check name="checkcircle" style={{fontSize:78,color:"lightgreen",}}/>
      </View>
       <Text style={{textAlign:'center',fontSize:18,color:'black'}}>Paid Invoice</Text>
       <Text style={{textAlign:'center',fontSize:18,color:'black'}}>{day} {month} {year}</Text>
       <View style={{marginTop:50}}>
       <View style={styles.view_2}><Text style={{fontSize:20, color:"#1A6DBB",fontWeight:'600'}}>Products Sold</Text></View>
        {details.map((x,index)=>{
          return(
      <View style={styles.view_1} key={index}> 
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:16, color:'black'}}>{x.name}</Text>
          </View>
          <View style={{alignSelf:'center',flexDirection:'row'}}>
          <Text style={{color:"#1A6DBB",fontSize:16}}>x {x.stock}</Text>
        </View>
      </View>
          )
        })
       }
        <View style={styles.view_2}><Text style={{fontSize:20, color:"#1A6DBB",fontWeight:'600'}}>Details</Text></View>
      <View style={styles.view_1}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:16, color:'black'}}>Owner's name: </Text>
          </View>
          <View style={{alignSelf:'center',flexDirection:'row'}}>
          <Text style={{fontSize:16, color:'black'}}>{user}</Text>
        </View>
      </View>
      <View style={styles.view_1}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:16, color:'black'}}>Total Price:</Text>
          </View>
          <View style={{alignSelf:'center',flexDirection:'row'}}>
          <Text style={{color:"black",fontSize:16}}>PKR </Text>
          <Text style={{color:"#1A6DBB",fontSize:16}}>{s_price}</Text>
        </View>
      </View>
      <View style={styles.view_1}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:16, color:'black'}}>Discount:</Text>
          </View>
          <View style={{alignSelf:'center',flexDirection:'row'}}>
         {discount!=s_price&&<Text style={{color:"#1A6DBB",fontSize:16}}>{discount}</Text>}
         {discount===s_price&&<Text style={{color:"#1A6DBB",fontSize:16}}>0</Text>}
        </View>
      </View>
      <View style={styles.view_1}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:16, color:'black'}}>Change Recieved:</Text>
          </View>
          <View style={{alignSelf:'center',flexDirection:'row'}}>
          <Text style={{color:"#1A6DBB",fontSize:16}}>{change_amount}</Text>
        </View>
      </View>
      <View style={styles.view_1}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:16, color:'black'}}>Inovice date:</Text>
          </View>
          <View style={{alignSelf:'center',flexDirection:'row'}}>
          <Text style={{color:"#1A6DBB",fontSize:16}}>{day} {month} {year}</Text>
        </View>
      </View>
      </View>
     </View>
    </ScrollView>
    </View>
    </>
  )
}

export default Invoice

const styles = StyleSheet.create({
    view_1:{borderTopWidth:1,borderTopColor:"gray",flexDirection:'row',justifyContent:'space-between',margin:8,paddingTop:10},
    view_2:{justifyContent:'space-between',margin:8,paddingTop:10},
    Grid:{flexDirection:'row',textAlign:'right'}
})

