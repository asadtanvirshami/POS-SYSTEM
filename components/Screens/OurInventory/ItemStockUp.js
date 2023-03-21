import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialTabs from 'react-native-material-tabs';

import MMKV from '../../../functions/mmks';
import { useMMKVStorage } from "react-native-mmkv-storage";

const ItemInfo = ({itemInfo, closeModal}) => {

    const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);  
    const [selectedTab, setSelectedTab] = useState(0);
    const [singleToggle, setSingleToggle] = useState(false);
    const [singleCount, setSingleCount] = useState(0);
    const [cartanToggle, setCartanToggle] = useState(false);
    const [cartanCount, setCartanCount] = useState(0);

    const [cp, setCp] = useState('');
    const [sp, setSp] = useState('');

    useEffect(() => {
        let prevInfo = {}
        prevInfo=myInventory.find(function(x){ return x.ItemId==itemInfo.id });
        if(prevInfo){
            console.log(prevInfo.cost_price)
            setSp((prevInfo.selling_price));
            setCp((prevInfo.cost_price));
            setSingleCount(prevInfo.qty)
            setCartanCount(parseInt((prevInfo.qty)/(itemInfo.cartan)))
        }else{ }
    }, [itemInfo])

    const handleClick=({countType, unitType, cartanToggle}) => {
        if(cartanToggle){
            setCartanToggle(true);
            setSingleToggle(true);
            setSingleCount(itemInfo.cartan)
            setCartanCount(1)
        }
        if(countType == '+'  &&  unitType == 'single'){
        let tempsate = singleCount+1
        setSingleCount(tempsate)
        if(singleCount==0){
            setSingleToggle(false);
        }
        if(tempsate>itemInfo.cartan){
            setCartanToggle(true);
            if(cartanCount==0){
                setCartanCount(1)
            }else{
                setCartanCount(parseInt(tempsate/itemInfo.cartan))
            }
        }else if(tempsate<itemInfo.cartan){
            setCartanToggle(false);
            setCartanCount(0)
        }
        }
        if(countType == '-'  &&  unitType == 'single'){
            let tempsate = singleCount-1
            setSingleCount(tempsate)
            if(tempsate==0){
            setSingleToggle(false);
             }
            if(tempsate>itemInfo.cartan){
            setCartanToggle(true);
            if(cartanCount==0){
                setCartanCount(1)
            }else{
                setCartanCount(parseInt(tempsate/itemInfo.cartan))
            }
            }else if(tempsate<itemInfo.cartan){
            setCartanToggle(false);
            setCartanCount(0)
            } 
        }
        if(countType == '+'  &&  unitType == 'cartan'){
            let tempsate = cartanCount+1
                setCartanCount(tempsate)
                setSingleCount(tempsate*itemInfo.cartan)
                
                if(tempsate<1){
                setSingleToggle(false)
                setCartanToggle(false)
                setCartanCount(0)
                setSingleCount(0)
                }
        }
        if(countType == '-'  &&  unitType == 'cartan'){
            let tempsate = cartanCount-1
                setCartanCount(tempsate)
                setSingleCount(tempsate*itemInfo.cartan)
                
                if(tempsate<1){
                setSingleToggle(false)
                setCartanToggle(false)
                setCartanCount(0)
                setSingleCount(0)
                }
        }
    }

    const checks = () => {
        let checkz= false
        if(cp!='' && sp!='' && singleCount>0){ checkz=true } else { checkz=false }
        return checkz
    }

  return (
    <View style={{flex:1}}>
        <View style={{flexDirection:'row'}}>
            <Image source={{uri:itemInfo.image}} style={styles.img} />
            <View style={styles.infoCon}>
                <Text style={styles.name}>{itemInfo.name}</Text>
                <Text style={styles.unit}>{itemInfo.units}</Text>
            </View>
        </View>
        <View>
            <MaterialTabs
                items={['Stock', 'Price']}
                selectedIndex={selectedTab}
                onChange={setSelectedTab}
                barColor="#ffffff"
                indicatorColor="#1A6DBB"
                indicatorHeight={3}
                activeTextColor="#373737"
                textStyle={{color:'#373737', width:100}}
            />
            <View style={{backgroundColor:'silver', height:1, marginBottom:12}}/>
        </View>
        {selectedTab==0 &&
        <>
            <View style={styles.stockCont}>
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../../../assets/images/iconpngs/singlebig.png')}
                        style={styles.singleIcon} />
                    <Text style={styles.unitCount}>
                        <Text style={{fontWeight:'900'}}>1</Text> Unit
                    </Text>
                </View>
                <View style={{flexDirection:'row'}}>
                {singleCount==0 &&
                <TouchableOpacity onPress={()=>{setSingleToggle(true); setSingleCount(1)}}>
                    <View style={styles.stockBtn}>
                        <Text style={{color:'white'}}>Stock Up</Text>
                    </View>
                </TouchableOpacity>
                }
                {singleCount>0 &&
                <View style={styles.stockBtnGrey}>
                    <TouchableOpacity style={styles.minusBtn} 
                    onPress={({countType='-',unitType='single'})=>(handleClick({countType,unitType}))}
                    >
                    <Text style={{color:'white', fontSize:15}}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.plusBtn} 
                    onPress={({countType='+',unitType='single'})=>(handleClick({countType,unitType}))}
                    >
                    <Text style={{color:'white', fontSize:15}}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.stockUpFont}>{singleCount}</Text>
                </View>
                }
                </View>
            </View>
            <View style={styles.stockCont}>
                <View style={{flexDirection:'row'}}>
                    <Image source={require('../../../assets/images/iconpngs/cartanbig.png')}
                        style={styles.singleIcon} />
                    <Text style={styles.unitCount}>
                        <Text style={{fontWeight:'900'}}>{itemInfo.cartan} </Text>Units
                    </Text>
                </View>
                <View style={{flexDirection:'row'}}>
                {cartanCount==0&&
                <TouchableOpacity  onPress={({cartanToggle=true})=>(handleClick({cartanToggle}))}>
                    <View style={styles.stockBtn}>
                        <Text style={{color:'white'}}>Stock Up</Text>
                    </View>
                </TouchableOpacity>
                }
                {cartanCount>0&&
                <View style={styles.stockBtnGrey}>
                    <TouchableOpacity style={styles.minusBtn} 
                    onPress={({countType='-',unitType='cartan'})=>(handleClick({countType,unitType}))} 
                    >
                    <Text style={{color:'white', fontSize:15}}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.plusBtn} 
                    onPress={({countType='+',unitType='cartan'})=>(handleClick({countType,unitType}))} 
                    >
                    <Text style={{color:'white', fontSize:15}}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.stockUpFont}>{cartanCount}</Text>
                </View>
                }
                </View>
            </View>

            <View style={styles.bottomCont}>
            <TouchableOpacity 
                style={!checks()?styles.disableBtn:styles.clearBtn}
                disabled={!checks()?true:false} 
                onPress={()=>{
                    setCartanCount(0);
                    setSingleCount(0);
                    let tempState = [...myInventory];
                    tempState=tempState.filter((x)=>{
                        return x.ItemId!=itemInfo.id
                    })
                    setCart(tempState)
                }}>
                <Text style={styles.btmBtnText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={!checks()?styles.disableBtn:styles.confirmBtn} 
                disabled={!checks()?true:false}
                onPress={()=>{
                    let tempData = [...myInventory];
                    let itemIndex = 0
                    let exists = false;
                    tempData.forEach((x, index)=>{
                        if(x.ItemId==itemInfo.ItemId){
                            itemIndex = index;
                            exists = true
                        }
                    })
                    if(exists==true){
                        tempData[itemIndex]={
                            id:'',
                            name:itemInfo.name,
                            units:itemInfo.units,
                            price:itemInfo.price,
                            cartan:itemInfo.cartan,
                            image:itemInfo.image,
                            c_price:cp,
                            s_price:sp,
                            qty:singleCount,
                            weight:itemInfo.weight,
                            ChildCategoryId:itemInfo.ChildCategoryId,
                            ItemId:itemInfo.ItemId,
                            Restock_alert:false,
                            check:false,
                            stock:1,
                            active:1,
                        }
                    }
                    setMyInventory(tempData);
                    closeModal();
                }}>
                <Text style={styles.btmBtnText}>Confirm</Text>
            </TouchableOpacity>
        </View>
        </>
        }
        {selectedTab==1 &&
            <View style={{marginTop:5}}>
            <View style={styles.priceCont}>
                <Text style={{fontSize:18, marginTop:10}}>Cost Price /<Text style={{fontSize:15}}> Unit</Text></Text>
                <TextInput style={{
                    borderColor:'#094ca5', borderBottomWidth:1, paddingLeft:10, borderRadius:3, paddingRight:10,
                    paddingTop:4, paddingBottom:0
                    }}
                 keyboardType="numeric" placeholder='Enter Amount' value={cp} onChangeText={(x)=>setCp(x)} />
            </View>
            <View style={[styles.priceCont, {marginTop:0}]}>
                <Text style={{fontSize:18, marginTop:10}}>Selling Price /<Text style={{fontSize:15}}> Unit</Text></Text>
                <TextInput style={{
                    borderColor:'#094ca5', borderBottomWidth:1, paddingLeft:10, borderRadius:3, paddingRight:10,
                    paddingTop:4, paddingBottom:0
                }}
                 keyboardType="numeric" placeholder='Enter Amount' value={sp} onChangeText={(x)=>setSp(x)} />
            </View>
            </View>
        }
        
    </View>
  )
}
export default ItemInfo

const styles = StyleSheet.create({
    img:{ 
        width:70,
        height:70,
        margin:10
    },
    infoCon :{
        margin:10,
        width:150,
        color:'#373737'
    },
    name:{ 
        fontWeight:'900',
        fontSize:15
    },
    unit:{ 
        fontWeight:'500'
    },
    unitCount:{ 
        color:'#373737', margin:14, width:60
    },
    stockCont:{
        flexDirection:'row', justifyContent:'space-between',
        padding:12
    },
    priceCont:{
        flexDirection:'row', justifyContent:'space-between',
        padding:5
    },
    icon:{
        color:'#1A6DBB',
        fontSize:50
    },
    singleIcon:{
        height:50,
        width:47
    },
    stockBtn:{
        backgroundColor:'#1A6DBB',
        paddingLeft:20,
        paddingRight:20,
        borderRadius:25,
        paddingBottom:3,
        paddingTop:3,
        color:'white',
        margin:14
    },
    stockBtnGrey:{
        backgroundColor:'silver',
        width:90,
        textAlign:'center',
        alignItems:'center',
        borderRadius:25,
        paddingBottom:3,
        paddingTop:3,
        color:'white',
        margin:14,
        height:25
    },
    stockUpFont:{
        color:'#373737', fontWeight:'900'
    },
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
    bottomCont:{
        flex:1,  flexDirection:'row', alignItems:'flex-end', justifyContent:'center'
    },
    clearBtn:{
        backgroundColor:'#AA4444',
        width:130,
        height:40,
        marginLeft:10,
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    confirmBtn:{
        backgroundColor:'#1A6DBB',
        width:130,
        height:40,
        marginLeft:10,
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    disableBtn:{
        backgroundColor:'silver',
        width:130,
        height:40,
        marginLeft:10,
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    btmBtnText:{
        color:'white',
        fontWeight:'900'
    }
})