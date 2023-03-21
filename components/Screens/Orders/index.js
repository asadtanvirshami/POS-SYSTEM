import React,{useEffect,useState} from 'react'
import {StyleSheet, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import MaterialTabs from 'react-native-material-tabs';

import API from '../../../apis/index.json'
import Header from '../../Shared/Header'
import Upcoming from './upcoming';
import Completed from './completed';

const OrderScreen = ({navigation}) => {
    const name = 'Orders'

    const [upcomingOrders, setUpcomingOrders] = useState([])
    const [completedOrders, setCompletedOrders] = useState([])

    const [itemInfoVisible, setItemInfoVisible] = useState(false)    
    const [customerInfoVisible, setCustomerInfoVisible] = useState(false)    
    const [loading, setLoading] = useState(true)    
    
    const [selectedTab, setSelectedTab] = useState(0)

  useEffect(() => {
   if(selectedTab==0){GetUpcomingOrdersOfCustomers()}
   if(selectedTab==1){GetCompletedOrdersOfCustomers()}
  }, [selectedTab])
  
  async function GetUpcomingOrdersOfCustomers(i){
    const Id = await AsyncStorage.getItem("@shop_id")
    axios.get(API.GetUpcomingOrdersByCustomer,{headers:{id:Id}}).then((r)=>{
    console.log(r.data)
    setUpcomingOrders(r.data)
    setLoading(false)
    })
  } 
  async function GetCompletedOrdersOfCustomers(i){
    setLoading(true)
    const Id = await AsyncStorage.getItem("@shop_id")
    axios.get(API.GetCompletedOrdersByCustomer,{headers:{id:Id}}).then((r)=>{
    console.log(r.data)
    setCompletedOrders(r.data)
    setLoading(false)
    })
  } 
    
  return (
      <>
      <Header name={name} navigation={navigation}/>
      <MaterialTabs
              uppercase={false}
              items={['Upcoming Orders', 'Completed Orders']}
              selectedIndex={selectedTab}
              onChange={setSelectedTab}
              barColor="#1A6DBB"
              indicatorColor="white"
              indicatorHeight={3}
              textStyle={{color:'white'}}
              activeTextColor="white"
            />
        {loading && 
          <ActivityIndicator color={'#1A6DBB'} size='large'
              style={{marginTop:'auto', marginBottom:'auto'}}
          />
        }
        {selectedTab==0 && upcomingOrders.length>0 && !loading &&<>
          {(customerInfoVisible || itemInfoVisible) && <View style={styles.modalBack}></View>}
          <View style={styles.Container}>
            <Upcoming setItemInfoVisible={setItemInfoVisible} itemInfoVisible={itemInfoVisible} items={upcomingOrders}/>
          </View>
          </>
        }
        {selectedTab==1 && completedOrders.length>0 && !loading &&<>
          {(customerInfoVisible || itemInfoVisible) && <View style={styles.modalBack}></View>}
          <View style={styles.Container}>
              <Completed setCustomerInfoVisible={setCustomerInfoVisible} customerInfoVisible={customerInfoVisible} items={completedOrders}/>
          </View>
          </>
        }
     </>
  )
}

export default OrderScreen

const styles = StyleSheet.create({
    Container:{backgroundColor:'white',flex:1},
    modalBack:{
      height:"100%", width:"100%",
      backgroundColor:'#373737', opacity:0.7, zIndex:1
    }
})