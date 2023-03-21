import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { 
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    ActivityIndicator, Image, ScrollView} from 'react-native';
import Header from '../../Shared/Header';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialTabs from 'react-native-material-tabs';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MMKV from '../../../functions/mmks';
import API from '../../../apis'
import { useMMKVStorage } from "react-native-mmkv-storage";

import Charge from '../../Shared/Charge';

const POSScreen = ({navigation}) => {
  const name = 'POS'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabs, setTabs] = useState([]);

  const [loading, setLoadoing] = useState(true);
  const [tabLoading, setTabLoadoing] = useState(false);

  const [items, setItems] = useState([{id:'all',tab:'All Items',items:[], fetched:false}])
  const [searchItems, setSearchItems] = useState([]);
  const [checkCharge, setCheckCharge] = useState (false);
  const [inventory, setInventory] = useState([]);

  const [charge, setCharge] = useMMKVStorage("charge", MMKV,[]);
  const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);  

  const handleClick=({countType, unitType},item)=>{
    
    if(countType == '+'  &&  unitType == 'single'){
          
          let tempData = [...charge];
          let itemIndex = 0
          let exists = false;

          tempData.forEach((x, index)=>{
          if(x.ItemId==item.ItemId){
           if(item.stock < x.qty)
           item.stock = item.stock + 1;
             itemIndex = index;
            exists = true}
          })
          if(exists==true){
              tempData[itemIndex]={
                  name:item.name,
                  units:item.units,
                  price:item.price,
                  cartan:item.cartan,
                  image:item.image,
                  selling_price:item.s_price,
                  cost_price:item.c_price,
                  qty:item.qty,
                  weight:item.weight,
                  ChildCategoryId:item.ChildCategoryId,
                  ItemId:item.ItemId,
                  stock:item.stock
              }}setCharge(tempData);}

    if(countType == 'add'  &&  unitType == 'select'){
              let tempData = [...charge];
              let tempState=[...inventory]
              let itemIndex = 0
              let exists = false;
              
              tempState.forEach((x, index)=>{
                if(x.ItemId == item.ItemId){
                  item.check = true
                  item.stock=1
                  tempData.push({
                    name:item.name,
                    units:item.units,
                    price:item.price,
                    cartan:item.cartan,
                    image:item.image,
                    selling_price:item.s_price,
                    cost_price:item.c_price,
                    qty:item.qty,
                    weight:0,
                    ChildCategoryId:item.ChildCategoryId,
                    ItemId:item.ItemId,
                    stock:item.stock})}
                setCharge(tempData)
                // console.log('=========',tempData)
              })
              
              tempData.forEach((x, index)=>{
                  if(x.ItemId==item.ItemId){
                    itemIndex = index;
                    exists = true
                  }setCharge(tempData)})

              if(exists==true){
                  tempData[itemIndex]={
                      name:item.name,
                      units:item.units,
                      price:item.price,
                      cartan:item.cartan,
                      image:item.image,
                      qty:item.qty,
                      selling_price:item.s_price,
                      cost_price:item.c_price,
                      weight:item.weight,
                      ChildCategoryId:item.ChildCategoryId,
                      ItemId:item.ItemId,
                      stock:item.stock,}}
              setCharge(tempData)
              setCheckCharge(true)}

    if(countType == '-'  &&  unitType == 'single'){ 
      let tempData = [...charge];
      let itemIndex = 0
      let exists = false;
      //console.log('============>',tempData)
      
      tempData.forEach((x, index)=>{
        if(x.ItemId==item.ItemId){
          itemIndex = index;
          exists = true
        }})
       
        if(exists==true){
          item.stock = item.stock - 1;
          if(item.stock==0 || item.stock<0){
              tempData.splice(itemIndex,1)
              item.check=false 
              setCharge(tempData);
              return }
              tempData[itemIndex]={
                  name:item.name,
                  units:item.units,
                  price:item.price,
                  cartan:item.cartan,
                  image:item.image,
                  qty:item.qty,
                  selling_price:item.s_price,
                  cost_price:item.c_price,
                  weight:item.weight,
                  ChildCategoryId:item.ChildCategoryId,
                  ItemId:item.ItemId,
                  stock:item.stock
              }
              setCharge(tempData)
          }
    }} 

  const isFocused = useIsFocused()

  useEffect(() => {
   let tempState=[]
   let chargeState=[...charge]
  if(charge != []){
  myInventory.forEach((y,index)=>{
  tempState.push({...y,check:false,stock:0})
  if (y.qty < 1 || y.qty == 0){
    tempState.pop(index,1)
  };  
  chargeState.forEach((x, indextwo)=>{
    if(x.ItemId==y.ItemId){
      if(indextwo!==index || indextwo == index){
      let ItemIndex=indextwo
      tempState[ItemIndex].check=true
      tempState[ItemIndex].stock=x.stock
      if(tempState[ItemIndex].check == false){
         console.log('inventory index',ItemIndex)
          console.log('charge index',indextwo)
          setCheckCharge(true)
        }}
        return;}})
      })}
      setInventory(tempState)
    }, [isFocused]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=>{
    //console.log(items[selectedTab])
    
    if(selectedTab!=0){
      if(items[selectedTab].fetched==false){
        //fetchItemsByTab(selectedTab)
      }
    }
  }, [selectedTab]);

  const fetchData = async() => {
    let shopCats = await AsyncStorage.getItem('@store_categories')
    let tempTabData = [];
    let tempTabNames = [];
    let tempItems=[];
    JSON.parse(shopCats).forEach((x)=>{
        if(x.ChildCategories.length>0){
          x.ChildCategories.map((x, i)=>{
            tempTabNames.push(x.name);
            tempItems.push({id:x.id,tab:x.name, items:[], fetched:false})
          })
        }
    })  
      tempItems[0].items=tempTabData;
      setTabs(tempTabNames);
      setLoadoing(false);
      setItems(tempItems);
  }
  
  const fetchItemsByTab = async(i) => {
    setTabLoadoing(true);
    await axios.get(API.GetGlobalInventoryItemsByTab,{
      headers: {'name': `${tabs[i]}`}
    }).then((res)=>{

      let tempStateItems = [...items];
      res.data.Items.forEach((x)=>{
        tempStateItems[i].items.push(x)
      })
      tempStateItems[i].fetched=true;
      setItems(tempStateItems);
      setLoadoing(false);
      setTabLoadoing(false);
    })
  }

  return (
    <>
    <View style={{flex:1,backgroundColor:'white'}}> 
    <Header navigation={navigation} name={name}/>
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
      <>
        <ScrollView>
        <View style={styles.content}>
        {
          inventory.filter((x)=>{
            if(x.name.toLowerCase().includes(searchTerm.toLowerCase())){
              return x
            }
            if(searchTerm==""){
              return x
            }
          }).filter((y)=>{
            if(y.ChildCategoryId==items[selectedTab].id){
              return y
            }
          }).map((item, index)=>{
            return(
              <View style={styles.box} key={index}>
                <Image style={styles.image} source={{uri:item.image}}/>
                <View style={{marginTop:10}}>
                <Text style={{color:'black',textAlign:'center', maxHeight:50, minHeight:50}}>{item.name}</Text>
                <Text style={{textAlign:'center', fontSize:13}}>{item.units}</Text>
                <Text style={{textAlign:'center', fontSize:14,color:item.qty>10?'#1A6DBB':item.qty<=10?'red':null,fontWeight:'600'}}>In Stock: {item.qty}</Text>
                  {item.check==true && <View style={styles.stockBtnGrey}>
                <TouchableOpacity style={styles.minusBtn} 
                onPress={({countType='-',unitType='single'})=>(handleClick({countType,unitType},item))}
                >
                <Text style={{color:'white', fontSize:15}}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.plusBtn} 
                onPress={({countType='+',unitType='single'})=>(handleClick({countType,unitType},item))}
                >
                <Text style={{color:'white', fontSize:15}}>+</Text>
                </TouchableOpacity>
                <Text style={styles.stockUpFont}>{item.stock}</Text>
                </View>}
                {item.check==false && 
                <View>
                <TouchableOpacity style={styles.select_btn} onPress={({countType='add',unitType='select'})=>(handleClick({countType,unitType},item))}>
                <Text style={{color:'white',fontSize:14,textAlign:'center'}}>Select</Text></TouchableOpacity>
                </View>}
                </View>
              </View>
            )
          })
        }
        </View>
        </ScrollView>
        {checkCharge && <Charge navigation={navigation}/>}
        {!checkCharge && <View></View>}
        </>
      }
      
    </>
    }
    {(loading==false && searchTerm!='') && 
    <>
      {tabLoading==false &&
      <>
        <ScrollView>
        <View style={styles.content}>
        {
          myInventory.filter((x)=>{
            if(x.name.toLowerCase().includes(searchTerm.toLowerCase())){
              return x
            }
            if(searchTerm==""){
              return x
            }
          }).map((item, index)=>{
            return(
              <View style={styles.box} key={index}>
                <Image style={styles.image} source={{uri:item.image}}/>
                <View style={{marginTop:10}}>
                <Text style={{color:'black',textAlign:'center', maxHeight:50, minHeight:50}}>{item.name}</Text>
                <Text style={{textAlign:'center', fontSize:13}}>{item.units}</Text>
                  {item.check==true && <View style={styles.stockBtnGrey}>
                <TouchableOpacity style={styles.minusBtn} 
                onPress={({countType='-',unitType='single'})=>(handleClick({countType,unitType},item))}
                >
                <Text style={{color:'white', fontSize:15}}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.plusBtn} 
                onPress={({countType='+',unitType='single'})=>(handleClick({countType,unitType},item))}
                >
                <Text style={{color:'white', fontSize:15}}>+</Text>
                </TouchableOpacity>
                <Text style={styles.stockUpFont}>{item.stock}</Text>
                </View>}
                {item.check==false && 
                <View>
                <TouchableOpacity style={styles.select_btn} onPress={({countType='add',unitType='select'})=>(handleClick({countType,unitType},item))}>
                <Text style={{color:'white',fontSize:14,textAlign:'center'}}>Select</Text></TouchableOpacity>
                </View>}
                </View>
              </View>
            )
          })
        }
        </View>
        </ScrollView>
        </>}
        </>}
    </View>
  </>
  )
}
export default POSScreen
const styles = StyleSheet.create({
  content: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent:'center',
    backgroundColor: 'white',
    padding: 8
  },
  box:{ 
  flexDirection: 'row', flexWrap: 'wrap',
  alignSelf:'center',
  justifyContent:'center',
   padding:15,
   margin:12,
   width:'36%',
   borderWidth:1,
   borderRadius:12,
   borderColor:'#1A6DBB' 
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
  unit:{ fontWeight:'500'},
  stockBtn:{backgroundColor:'#1A6DBB',
  padding:5,width:90,textAlign:'center',
  color:'white',borderRadius:5},
  stockBtnGrey:{
    backgroundColor:'silver',
    width:80,
    textAlign:'center',
    alignItems:'center',
    borderRadius:25,
    paddingBottom:3,
    paddingTop:3,
    marginTop:10,
    color:'white',
    height:25
  },
  stockUpFont:{color:'#373737', fontWeight:'900'},
  minusBtn:{
    backgroundColor:'#1A6DBB',
    width:32,height:32,
    justifyContent:'center',
    position:'absolute', borderRadius:25,
    left:-10,top:-3,
    textAlign:'center',
    alignItems:'center',
  },
  plusBtn:{
    backgroundColor:'#1A6DBB',
    width:32,height:32,
    justifyContent:'center',
    position:'absolute', borderRadius:25,
    right:-10,top:-3,
    textAlign:'center',
    alignItems:'center',
  },
  select_btn:{backgroundColor:'#1A6DBB',
  alignSelf:'center',borderRadius:5,
  padding:5,width:90,marginTop:10}
})