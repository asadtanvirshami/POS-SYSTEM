import React,{useState,useEffect} from 'react'
import { 
StyleSheet,Text,View,Modal,TextInput,ActivityIndicator, 
ScrollView,TouchableOpacity,Image 
} from 'react-native'

import { useMMKVStorage } from "react-native-mmkv-storage";
import axios from 'axios';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialTabs from 'react-native-material-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MMKV from '../../../functions/mmks';
import ItemStockUp from './ItemStockUp'
import Header from '../../Shared/Header'

const Orders = ({navigation}) => {
  const name = 'My Inventory'
  const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);  
  const [itemInfo, setItemInfo] = useState({});
  const [tabs, setTabs] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoadoing] = useState(true);
  const [tabLoading, setTabLoadoing] = useState(false);

  const [items, setItems] = useState([{id:'all',tab:'All Items',items:[], fetched:false}])

  useEffect(() => {
  let tempState=[]
  myInventory.forEach((y,index)=>{
    tempState.push({...y,check:false,stock:0})
  //  if (y.qty < 1 || y.qty == 0){
  //   tempState.splice(index,1)
  //   return;
  //   };
    })
    setMyInventory(tempState)
  }, [])

  const closeModal = () => {setModalVisible(false);}

  const handleClick=({countType, unitType},x)=>{

    if(countType == 'stock-up'){
      let tempState=[...myInventory]
      setItemInfo(x)
      setModalVisible(true)
      tempState.forEach((y, index)=>{
        if(x.ItemId == y.ItemId){
          setMyInventory(tempState)
          //console.log('===========myInventory',tempState)
        }})
    }}

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
        <View>
        {
          myInventory.filter((x)=>{
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
          }).map((x, index)=>{
            return(
              <View key={index} style={styles.content}>
              <View key={index}  style={{width:200, flexDirection:'row'}}>
              <Image source={{
                  uri:x.image
                }} style={styles.image}/>
              <View style={{padding:3,paddingLeft:10,maxWidth:300}}>
              <Text style={{fontWeight:'bold', fontSize:14}}>{x.name}</Text>
              <Text style={{marginBottom:3}}>{x.units}</Text>
              <Text style={styles.price}>Selling Price: Rs.{x.s_price}</Text>
              <Text style={{color:x.qty>10?'#1A6DBB':x.qty<=10?'red':null,fontWeight:'600'}}>In Stock: {x.qty}</Text>
              </View>
              </View>
              { x.check == false && <View style={{alignSelf:'center'}}>
              <View>
              <TouchableOpacity 
            onPress={({countType='stock-up'})=>(handleClick({countType},x))}
            style={{
              backgroundColor:'#1A6DBB', paddingLeft:23, paddingRight:23,
              borderRadius:25, paddingBottom:3, paddingTop:3
              }}>
            <Text style={{color:'white'}}>Stock Up</Text>
          </TouchableOpacity>
              </View>
              </View>}
              </View>
            )})}
        </View>
        </ScrollView>
        </>}   
    </>
    }
    {(loading==false && searchTerm!='') && 
    <>
      {tabLoading==false &&
       <>
       <ScrollView>
       <View>
       {
         myInventory.filter((x)=>{
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
         }).map((x, index)=>{
           return(
             <View key={index} style={styles.content}>
             <View key={index}  style={{width:200, flexDirection:'row'}}>
             <Image source={{
                 uri:x.image
               }} style={styles.image}/>
             <View style={{padding:3,paddingLeft:10,maxWidth:300}}>
             <Text style={{fontWeight:'bold', fontSize:14}}>{x.name}</Text>
             <Text style={{marginBottom:3}}>{x.units}</Text>
             <Text style={styles.price}>Selling Price: Rs.{x.s_price}</Text>
             <Text style={{color:x.qty>10?'#1A6DBB':x.qty<=10?'red':null,fontWeight:'600'}}>In Stock: {x.qty}</Text>
             </View>
             </View>
             { x.check == false && <View style={{alignSelf:'center'}}>
             <View>
             <TouchableOpacity 
           onPress={({countType='stock-up'})=>(handleClick({countType},x))}
           style={{
             backgroundColor:'#1A6DBB', paddingLeft:23, paddingRight:23,
             borderRadius:25, paddingBottom:3, paddingTop:3
             }}>
           <Text style={{color:'white'}}>Stock Up</Text>
         </TouchableOpacity>
             </View>
             </View>}
             </View>
           )})}
       </View>
       </ScrollView>
       </>}
        </>}
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
            <ItemStockUp itemInfo={itemInfo} closeModal={closeModal} />
          </View>
        </View>
     </Modal>
        </View>
</>
  )
}

export default Orders

const styles = StyleSheet.create({
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
  cross:{
    position:'absolute',
    top:20,
    right:22,
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
    color:'#1A6DBB',
    fontSize:14,
    fontWeight:'600'
  },
  stockBtnGrey:{
    backgroundColor:'silver',
    width:80,
    textAlign:'center',
    alignItems:'center',
    borderRadius:25,
    paddingBottom:3,
    paddingTop:3,
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