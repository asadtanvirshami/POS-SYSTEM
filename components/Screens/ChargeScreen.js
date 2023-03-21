import React, { useState,useEffect,useRef } from "react";
import { useMMKVStorage } from "react-native-mmkv-storage";
import {StyleSheet,Text,View,Image,TouchableOpacity,ScrollView,TextInput} from 'react-native'
import moment from 'moment';
import MMKV from '../../functions/mmks';

const ChargeScreen = ({navigation}) => {
  
    const [charge, setCharge] = useMMKVStorage("charge", MMKV,[]);   
    const [myInventory, setMyInventory] = useMMKVStorage("inventory", MMKV,[]);
    const [myRecords, setMyRecords] = useMMKVStorage("sales", MMKV,[]);


    const isPercentage = useRef('');
    const [percentageButton, setPercentageButton] = useState(true);
  
    const [isRupees, setIsRupees] = useState('');

    const [confirm,setConfirm] = useState(false);
    const [selling, setSelling] = useState ('');
    const [cost, setCost] = useState ('');

    const [changeAmount, setChangeAmount] = useState ('');
    const [changeState, setChangeState] = useState ('');
    const [discount, setDiscount] = useState ('');

    useEffect(() => {
    let value = selling
    if(percentageButton){
      if(isRupees>selling){
        value = selling
      }
      if(isRupees<=selling){
        value = selling-isRupees
        setDiscount(value)
      }
    }
    if(!percentageButton){
      if(isRupees>selling){
        value = selling
      }
      if(isRupees<=selling){
        let discountPrice= Math.round(parseFloat(selling/100 * isRupees))
        if(discountPrice>selling){
          value = selling
        }
        value = selling - discountPrice
        setDiscount(value)
      }
    }
  }, [isRupees,selling,discount])
  
    const calCulation = () => {
      //calcutation for the selling price.
      let tempProfit = 0;
      let tempPrice = 0;
      charge.forEach((x)=>{
          tempProfit = tempProfit + parseFloat(x.selling_price)*parseFloat(x.stock)
          tempPrice = tempPrice + parseFloat(x.cost_price)*parseFloat(x.stock)
      })
      setSelling(tempProfit)
      setCost(tempPrice)
    }

    useEffect(() => {
      calCulation()
    }, [selling])

    useEffect(() => {
      let value = discount
        if(changeAmount<discount){
          value=0
        } 
        if(changeAmount>discount){
          value = parseInt(changeAmount-discount)
        }
        setChangeState(value)
    }, [changeAmount,discount])

     useEffect(() => {
      if(charge.length<1||charge.length==0){
        navigation.navigate("POS")
        }
    //   //automatically removing the product from array if stock is 0
    //   // let tempState = [...charge]
    //   // tempState.forEach((y, index) => {
    //   //   if (y.stock < 1 || y.stock == 0){
    //   //       tempState.splice(index,1)
    //   //       setCharge(tempState)
    //   //       
    //   //       return;
    //   //       }});
    //   //       console.log('length',charge.length)
           
    }, [charge])

    const handleClick=({countType, unitType},x)=>{
       if(countType == '+'  &&  unitType == 'single'){
        let tempState = [...charge];
        tempState.forEach((y, index) => {
            if(x.ItemId==y.ItemId){
              if(x.stock < y.qty){
              x.stock = x.stock + 1;
              setSelling(y.stock)
            }
          }
          });
          setCharge(tempState);
        }

       if(countType == '-'  &&  unitType == 'single'){
        let tempState = [...charge];
        tempState.forEach((y, index) => {
          if (y.stock<=0 || y.stock == 0){
          if(y.ItemId==x.ItemId){
              tempState.splice(index, 1); // 2nd parameter means remove one item only
              console.log(index)
                return;
               }}
          else if(y.ItemId==x.ItemId){
            y.stock = y.stock - 1;
            setSelling(x.stock*x.selling)
          } 
        });
        setCharge(tempState);}

        if(countType == 'percent'){
        let value = selling 
        if(percentageButton==true){
          let discountPrice= Math.round(parseFloat(selling/100 * isRupees))
        if(discountPrice>selling){
          value = selling
        }
        value = selling - discountPrice
        setPercentageButton(false)
        setDiscount(value)
        }

        if(percentageButton==false){
          let value = selling 
          value = selling-isRupees
          setDiscount(value)
          setPercentageButton(true)
        }}
  
        if(countType == 'confirm'){
          setConfirm(true)
          let tempData = [...myInventory]
          let tempState = [...charge]
          let tempInvoice = [...myRecords]

            tempInvoice.push({
              s_price:selling,
              c_price:cost,
              day:'15',
              date:'12/15/22',
              month_num:'12',
              month:"December",
              year:'2022',
              change_amount:changeState,
              discount:discount,
              ammount_recieved:changeAmount,
              pd_details:charge
            })
            setMyRecords(tempInvoice)
            console.log([tempInvoice])

          tempState.forEach((x,index)=>{
            tempData.forEach((y,indexTwo)=>{
              const newQty = y.qty-x.stock

              if(x.ItemId == y.ItemId){
                //console.log('id con',x.ItemId == y.ItemId, 'indexCharge', index, 'indexInv',indexTwo,'id charge', x.ItemId,'id inv',y.ItemId)
                if(y.qty<10 || y.qty-x.stock<=10){
                  tempData[indexTwo]={
                    id:'',
                    units:y.units,
                    s_price:y.s_price,
                    c_price:y.c_price,
                    qty:newQty,
                    name:y.name,
                    ItemId:y.ItemId,
                    ShopId:y.ShopId,
                    ChildCategoryId:y.ChildCategoryId,
                    weight:y.weight,
                    image:y.image,
                    cartan:y.cartan,
                    Restock_alert:true,
                    stock:1,
                    active:1,
                  }
                  
                }else{
                  tempData[indexTwo]={
                    id:'',
                    units:y.units,
                    s_price:y.s_price,
                    c_price:y.c_price,
                    qty:newQty,
                    name:y.name,
                    ItemId:y.ItemId,
                    ShopId:y.ShopId,
                    ChildCategoryId:y.ChildCategoryId,
                    weight:y.weight,
                    image:y.image,
                    cartan:y.cartan,
                    stock:1,
                    active:1,
                  }
                }
                setMyInventory(tempData)    
                // console.log(newQty)
              }
            })
          })  
        }} 

  return (
      <>
  <View style={{flex:1,backgroundColor:"white"}}>
    <View>
      <ScrollView style={{padding:5}}>
      {charge.map((x,index)=>{
        return(
        <View key={index}>
        <View style={Card}>
          <View style={Grid}>
            <View style={Card.image_view}>
            <Image style={Card.image}  source={{ uri:x.image }}/>
            </View>
            <View style={Card.detail_view}>
            <Text style={Card.heading}>{x.name}</Text>
            <Text style={Card.units}>{x.units}</Text>
            <View style={{marginTop:5}}>
            <View style={Grid}>
            <Text style={Card.qty}>Quantity:{x.qty} </Text>
            <Text style={Card.cartan}> Cartan:{x.cartan}</Text>
            </View>
            </View>
            </View>
            <View style={Card.btn_view}>
            <View style={{flexDirection:'row'}}>
            {!confirm &&
            <View style={Card.stockBtnGrey}>
            <TouchableOpacity style={Card.minusBtn} onPress={({countType='-',unitType='single'})=>(handleClick({countType,unitType},x))}>
            <Text style={{color:'white', fontSize:15}}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Card.plusBtn} onPress={({countType='+',unitType='single'})=>(handleClick({countType,unitType},x))}>
            <Text style={{color:'white', fontSize:15}}>+</Text>
            </TouchableOpacity>
            <Text style={Card.stockUpFont}>{x.stock}</Text>
            </View>}
            {confirm &&
            <View style={Card.stockBtnDisabled}>
            <Text style={{fontSize:16}}>x{x.stock}</Text>
            </View>}
            </View>
            </View>
            </View>
            </View>
          </View>)
            })}
         </ScrollView>
        </View>
       </View>
         <View style={styles.subtotal_box}>
          <View style={Grid}>
            <View style={styles.subtotal_view}>
              <Text style={styles.subtotal_text}>Subtotal:</Text>
              <TouchableOpacity>
                <Text style={styles.subtotal_text}>Discount:</Text></TouchableOpacity>
              <Text style={styles.subtotal_text}>Total Pay:</Text>
            </View>
            <View style={styles.subtotal_view_2}>
            {!confirm &&
          <View>
              <Text style={styles.totalprice_text}>Rs.{selling}</Text>
              <View style={{flexDirection:'row'}}>
              <TextInput style={styles.input_discount}  onChangeText={setIsRupees} keyboardType='numeric'/>
              {percentageButton&&<TouchableOpacity ref={isPercentage} on onPress={({countType='percent'})=>(handleClick({countType}))} style={styles.discount_false}>
              <Text style={styles.percentage_text}>%</Text>
              </TouchableOpacity>}
              {!percentageButton&&<TouchableOpacity ref={isPercentage} on onPress={({countType='percent'})=>(handleClick({countType}))} style={styles.discount_true}>
              <Text style={styles.percentage_text}>%</Text>
              </TouchableOpacity>}
              </View>
              <Text style={styles.totalprice_text}>Rs.{discount}</Text>
          </View>}
            {confirm &&
          <View>
              <Text style={styles.totalprice_text}>Rs.{selling}</Text>
              <View style={{flexDirection:'row'}}>
              {isRupees==''&&<View><Text style={styles.totalprice_text}>0</Text></View>}
              {isRupees!=''&&<View><Text style={styles.totalprice_text}>{isRupees}</Text></View>}
              </View>
              <Text style={styles.totalprice_text}>Rs.{discount}</Text>
          </View>}
            </View>
            </View>
            {!confirm &&
            <View style={{justifyContent:'center',alignSelf:'center'}}>
            <View style={{marginBottom:10, flexDirection:'row'}}>
                <Text style={{fontSize:16,color:'#1A6DBB',fontWeight:'600'}}>Change:</Text>
                <Text style={{fontSize:16,fontWeight:'600'}}> Rs.{changeState}</Text>
              </View>
            <Text>Ammount Recieved</Text>
            <TextInput onChangeText={setChangeAmount} keyboardType='numeric' style={styles.input}/>
            <TouchableOpacity onPress={({countType='confirm'})=>(handleClick({countType}))} style={styles.confirm_btn}><Text style={{color:'white',fontWeight:'600',fontSize:16}}>Confirm</Text></TouchableOpacity>
        </View>}
            {confirm &&
            <View style={{left:20, marginBottom:100}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:16,color:'#1A6DBB',fontWeight:'600'}}>Change:</Text>
                <Text style={{fontSize:16,fontWeight:'600'}}> Rs.{changeState}</Text>
              </View>
              <View style={{marginBottom:10, flexDirection:'row'}}>
            {changeAmount==''&&<Text>Ammount Recieved: Rs.0</Text>}
            {changeAmount!=''&&
            <>
            <Text style={{fontSize:16}}>Ammount Recieved:</Text>
            <Text style={{fontSize:16, color:'#1A6DBB',fontWeight:'600'}}>Rs.{changeAmount}</Text>
            </>
            }
            </View>
            <View style={{justifyContent:'center',alignSelf:'center', right:20,top:50}}>
            <TouchableOpacity  style={styles.confirm_btn} onPress={()=>(setCharge(),navigation.navigate("POS"))}>
            <Text style={{color:'white',fontWeight:'600',fontSize:16}}>Ok</Text></TouchableOpacity>
            </View>
        </View>}
      </View>
      </>
  )
}
export default ChargeScreen
const Grid = StyleSheet.create({flexDirection: 'row'});
const styles = StyleSheet.create({
    subtotal_box: {borderTopWidth:1,borderTopColor:'silver',flex:0, justifyContent: 'flex-end',bottom:0,position:'relative',backgroundColor:'white'},
    subtotal_view: {justifyContent: 'flex-end', flex: 5, margin: 20,position:'relative'},
    subtotal_view_2: {justifyContent: 'flex-end', flex: 2, margin: 20,position:'relative'},
    totalprice_view: {position:'relative', right:0, justifyContent:'flex-end',flexDirection:'row',margin: 20,flex: 5,},
    subtotal_text: {fontSize: 18, fontWeight: '600'},
    totalprice_text: {fontSize: 16, fontWeight: '600', color: '#108de0'},
    percentage_text:{color:"white",textAlign:'center',paddingLeft:6,paddingRight:6,fontWeight:"600",fontSize:18},
    discount_true:{color:'white',fontSize: 18, fontWeight: '600',backgroundColor:'#1A6DBB',alignSelf:'center',borderRadius:5},
    discount_false:{color:'white',fontSize: 18, fontWeight: '600',backgroundColor:'silver',alignSelf:'center',borderRadius:5},
    input:{borderColor:'silver',borderBottomWidth:1,width:300,marginBottom:20, justifyContent:'center',padding:0},
    input_discount:{borderColor:'silver',borderBottomWidth:1,width:60,justifyContent:'center',padding:0 ,fontSize:16}, 
    confirm_btn:{backgroundColor:'#1A6DBB', alignSelf:'center',paddingLeft:30,paddingRight:30, padding:8,margin:8,borderRadius:5},
  });
const Card = StyleSheet.create({
  borderBottomColor:'silver',borderBottomWidth:1, 
  backgroundColor:'white',padding:15,
  image_view: {flex: 2},
  image: {
    alignSelf:'center',
    height:60,
    width:60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'silver',
  },
  detail_view:{flex:4,alignSelf:'center'},
  heading:{fontWeight:'600',color:"#1f1e1d"},
  units:{color:'gray'}, 
  qty:{fontSize:14,color:'#1f1e1d'},
  cartan:{fontSize:14,color:'#1f1e1d'},
  btn_view:{flex:2, alignSelf:'flex-end'},
  btn:{alignSelf:"center"},
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
  stockBtnDisabled:{ backgroundColor:'white',
  width:80,
  textAlign:'center',
  alignItems:'center',
  borderRadius:25,
  paddingBottom:3,
  paddingTop:3,
  color:'white',
  height:25}
})
