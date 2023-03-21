import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,ActivityIndicator, Image, ScrollView, Modal} from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Entypo';
import MaterialTabs from 'react-native-material-tabs';

import Header from '../../Shared/Header';
import API from '../../../apis/index.json';
import ItemInfo from './ItemInfo';
import Cart from '../../Shared/Cart';

import MMKV from '../../../functions/mmks';
import { useMMKVStorage } from "react-native-mmkv-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inventory = ({navigation}) => {
  const name = 'Global Inventory'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  
  const [items, setItems] = useState([{id:'all',tab:'All Items',items:[], fetched:false}])
  const [tabs, setTabs] = useState([]);
  const [searchItems, setSearchItems] = useState([]);
  const [itemInfo, setItemInfo] = useState({});
  
  const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);  
  const [myReStock, setMyRestock] = useMMKVStorage("inventory", MMKV,[]);
  
  const [loading, setLoadoing] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [tabLoading, setTabLoadoing] = useState(false);

  const isFocused = useIsFocused()


  useEffect(() => {fetchData();}, [isFocused]);

  useEffect(()=>{
    if(selectedTab!=0){
    if(items[selectedTab].fetched==false){fetchItemsByTab(selectedTab)}
    }
  }, [selectedTab]);

  useEffect(() => {searchProduct(searchTerm);}, [searchTerm]);

  const searchProduct = async(term) => {
    if(term.length>2){
      let shopCats = await AsyncStorage.getItem('@shop_categories')
      axios.get(API.GetGlobalInventoryItemsBySearch,{
        headers: {'searchword': `${term}`, 'catids':shopCats}
      }).then((res)=>{
        setSearchItems(res.data);
      })
    }else if(term.length<2){
      setSearchItems([]);
    }
  }

  const fetchData = async() => {
    let shopCats = await AsyncStorage.getItem('@store_categories')
    await axios.get('https://thin-battle-land.glitch.me/categories/getShopCategories',{
      headers:{catids:shopCats}
    }).then(async(res)=>{
      let childCatName = '';
      res.data.forEach((x)=>{
        if(x.ChildCategories.length>0 && childCatName==''){
          childCatName=x.ChildCategories[0].name
        }})

      let tempTabNames = [];
      let tempTabData = [];
      
      tempTabData = await axios.get(API.GetGlobalInventoryItemsByTab,{headers:{'name':`${childCatName}`}}).then((x)=>x.data.Items)
      tempTabData.forEach((x,index)=>{
        tempTabData[index].check=false
      })
      let tempItems=[];
      res.data.forEach(element => {
        if(element.ChildCategories.length>0){
          element.ChildCategories.map((x, i)=>{
            tempTabNames.push(x.name);
            tempItems.push({id:x.id,tab:x.name, items:[], fetched:false})
          })}   
       })
      tempItems[0].items=tempTabData;
      setTabs(tempTabNames);
      setLoadoing(false);
      
      tempItems[0].items.forEach((x,index)=>{
        myInventory.forEach((y,indexTwo)=>{
          if(x.id === y.ItemId){
            tempTabData[index].check=true}})
      })
      setItems(tempItems);})}

  const fetchItemsByTab = async(i) => {
    setTabLoadoing(true);
  await axios.get(API.GetGlobalInventoryItemsByTab,{
    headers: {'name': `${tabs[i]}`}
  }).then((res)=>{
    let tempStateItems = [...items];
    res.data.Items.forEach((x)=>{
    tempStateItems[i].items.push(x)})
  for (let i = 0 ; i<=items[selectedTab].items.length; i++){
    tempStateItems[selectedTab].items.forEach((x,index)=>{
      if(i == index){
      if(x.id === items[selectedTab].items[i].id){
      tempStateItems[selectedTab].items[i].check =false 
      }return
      }})}

    tempStateItems[i].fetched=true;
    for (let i = 0 ; i<=items[selectedTab].items.length; i++){
      tempStateItems[selectedTab].items.forEach((x,index)=>{
        if(i==index){
      myInventory
      .forEach((y,indexTwo)=>{
      if(items[selectedTab].items[i].id === y.ItemId){
        tempStateItems[selectedTab].items[i].check = true
        }}) 
        return
      }})}
      
      setItems(tempStateItems);
      setLoadoing(false);
      setTabLoadoing(false);
    })
  }

  const closeModal = () => {setModalVisible(false);}

  return (
    <>
    <View style={{flex:1,backgroundColor:'white'}}>
    
    <Header navigation={navigation} name={name} />
    <View style={{backgroundColor:'#1A6DBB'}}>
    <TextInput
        style={styles.input}
        placeholder="Search"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity style={styles.cross} onPress={()=>setSearchTerm('')}>
        <Icon name="cross" color={'silver'} size={26} />
      </TouchableOpacity>
    </View>
    {loading==true && 
      <ActivityIndicator color={'#1A6DBB'} size='large'
        style={{marginTop:'auto', marginBottom:'auto'}}
      />
    }
    {(loading==false && searchTerm=='') && 
    <>
      <MaterialTabs
        uppercase={false}
        scrollable={true}
        items={tabs}
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
        barColor="#1A6DBB"
        indicatorColor="white"
        indicatorHeight={3}
        textStyle={{color:'white'}}
        activeTextColor="white"
      />
      {
        tabLoading==true &&
        <ActivityIndicator color={'#1A6DBB'} size='large'
        style={{marginTop:'auto', marginBottom:'auto'}} 
      />
      }
      {tabLoading==false &&
        <ScrollView>
        {
          items[selectedTab].items.map((item, index)=>{
            return(
            <View key={index} style={styles.content}>
               <View style={{width:200, flexDirection:'row'}}>
                <Image
                  style={styles.image}
                  source={{
                    uri:item.image
                  }}
                />
                <View style={{padding:10 ,maxWidth:200}}>
                <Text style={{fontWeight:'bold'}}>{item.name}</Text>
                <Text>{item.units}</Text>
                </View>
               </View>
              <View style={{alignSelf:'center'}}>
                {item.check==true && <TouchableOpacity
                 disabled={true}
                  style={{
                    backgroundColor:'#1A6DBB', paddingLeft:25, paddingRight:25,
                    borderRadius:25, paddingBottom:3, paddingTop:3,opacity:0.7
                    }}
                    onPress={()=>{setModalVisible(true); setItemInfo(item)}}
                    >
                  <Text style={{color:'white'}}>Added</Text>
                </TouchableOpacity>}
                {item.check==false && <TouchableOpacity
                  style={{
                    backgroundColor:'#1A6DBB', paddingLeft:25, paddingRight:25,
                    borderRadius:25, paddingBottom:3, paddingTop:3
                    }}
                    onPress={()=>{setModalVisible(true); setItemInfo(item)}}
                    >
                  <Text style={{color:'white'}}>info</Text>
                </TouchableOpacity>}
              </View>
            </View>
            )
          })
        }
        </ScrollView>
      }
    </>
    }
    {searchTerm!=="" &&
      <ScrollView>
        {
          searchItems.map((item, index)=>{
            return(
            <View key={index} style={styles.content}>
               <View style={{width:200, flexDirection:'row'}}>
                <Image style={styles.image} source={{ uri:item.image }} />
                <View style={{padding:10 ,maxWidth:200}}>
                <Text style={{fontWeight:'bold'}}>{item.name}</Text>
                <Text>{item.units}</Text>
                </View>
               </View>
              <View style={{alignSelf:'center'}}>
                <TouchableOpacity style={{
                    backgroundColor:'#1A6DBB', paddingLeft:30, paddingRight:30,
                    borderRadius:25, paddingBottom:3, paddingTop:3
                }} onPress={()=>{setModalVisible(true); setItemInfo(item)}}>
                  <Text style={{color:'white'}}>Info</Text>
                </TouchableOpacity>
              </View>
            </View>
            )
          })
        }
      </ScrollView>
    }
    {modalVisible && <View style={styles.modalBack}></View>}
     <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.buttonClose} onPress={()=>setModalVisible(!modalVisible)}>
                <Icon name="cross" color={'grey'} style={styles.modalCross} />
            </TouchableOpacity>
            <ItemInfo itemInfo={itemInfo} closeModal={closeModal} />
          </View>
        </View>
     </Modal>
      {!loading && <Cart navigation={navigation}/>}
    </View>
  </>
  )
}
export default Inventory
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
    height:50,
    width:50,
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
    height:'70%',
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
  modalBack:{
    position:'absolute', height:"100%", width:"100%",
    backgroundColor:'#373737', opacity:0.7, zIndex:1
  }
})