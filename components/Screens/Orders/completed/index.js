import React,{useState} from 'react'
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native'

import Icon from 'react-native-vector-icons/Entypo';
import Check from 'react-native-vector-icons/EvilIcons' 

import OrderInfo from './OrderInfo';

const Completed = ({items,customerInfoVisible,setCustomerInfoVisible}) => {
    const [orderInfoDetail, setOrderInfoDetail] = useState({});
    
  return (
      <>
      <View style={{}}>
        <View style={styles.main_view}>
            <ScrollView>
                {items.map((item,index)=>
                {return(
                  <TouchableOpacity key={index} style={styles.content} 
                  onPress={()=>{setCustomerInfoVisible(true);setOrderInfoDetail(item)}}>
                  <View style={{width:200, flexDirection:'row'}}>
                   <View style={{padding:10 ,maxWidth:200}}>
                   <Text style={{fontWeight:'bold'}}>{item.User.f_name} {item.User.l_name}</Text>
                   </View>
                  </View>
                 <View style={{alignSelf:'center',flexDirection:'row'}}>
                 <Check style={{fontSize:36, color:'lightgreen'}} name='check'/>
                  <View>
                   </View>
                 </View>
               </TouchableOpacity>)})}
            </ScrollView>
        </View>
      </View>

     <Modal
        animationType="fade"
        transparent={true}
        visible={customerInfoVisible}
        onRequestClose={() => {
        setCustomerInfoVisible(!customerInfoVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.buttonClose} onPress={()=>setCustomerInfoVisible(!customerInfoVisible)}>
                <Icon name="cross" color={'grey'} style={styles.modalCross} />
            </TouchableOpacity>
            <OrderInfo orderItem={orderInfoDetail}/>
          </View>
        </View>
     </Modal>
     </>
  )
}

export default Completed

const styles = StyleSheet.create({
    Container:{backgroundColor:'white',flex:1},
    main_view:{margin:5},
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
    input: {
      height:46,
      borderWidth: 0,
      borderRadius: 10,
      paddingLeft: 30,
      borderWidth:1,
      borderRadius:55,
      borderColor:'silver',
      margin:10,
      paddingRight:40,
      backgroundColor:'white'
    },
    cross:{
      position:'absolute',
      top:20,
      right:22,
    },
    image:{
      height:60,
      width:60,
      margin:5
    },
    //modalstyles
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    modalView: {
      width:'90%',
      height:'67%',
      alignSelf:'center',
      backgroundColor: "white",
      borderRadius: 20,
      padding: 30,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    buttonClose: {
      position:'absolute',
      top:7,
      right:7,
    },
    modalCross:{
      color:'grey',
      fontSize:22,
      backgroundColor:'white',
      padding:10,
      borderRadius:50
    },
})