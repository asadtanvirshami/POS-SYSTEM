import { StyleSheet, Text, View, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Form, FormItem, Label } from 'react-native-form-component';
import React, { useEffect, useState } from 'react';
import API from '../../apis/index.json';
import jwt_decode from "jwt-decode";
import axios from 'axios';

const SignUp = ({navigation}) => {
  
  const [codeScreen, setCodeScreen] = useState(false);
  const [contact, setContact] = useState('');
  const [f_name, setF_name] = useState('');
  const [l_name, setL_name] = useState('');
  const [load, setLoad] = useState(false);
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    return () => { setCode(''); setLoad(false); }
  }, [])

  const handleSubmit = () => {
    
    if(email.length>10 && cnic.length==15 && f_name.length>3 && l_name.length>3 && contact.length==11){
      setLoad(true);
      setTimeout(
        async function() {
          await axios.post(API.PostAccountSignUp, { 
            f_name:f_name,
            l_name:l_name,
            email:email,
            contact:contact,
            cnic:cnic,
            type:"shopowner"
        })
          .then((x)=>{
            console.log(x.data);
            if(x.data.status=='error'){
              setLoad(false);
              Alert.alert("Please Try Again",`${x.data.message}`);
            }else if(x.data.status=='success'){
              setCodeScreen(true);
              setLoad(false);
            }
          })
      }, 3000);
    }
    if(f_name.length<4){
      Alert.alert("Invalid First Name","Please Enter a valid Name");
      return;
    }
    if(l_name.length<4){
      Alert.alert("Invalid Last Name","Please Enter a valid Name");
      return;
    }
    if(email.length<11){
        Alert.alert("Email Error","Please Enter a valid email");
        return;
    }
    if(contact.length!=11){
      Alert.alert("Invalid Contact No.","Please Enter a valid Number");
      return;
    }
    if(cnic.length!=15){
      Alert.alert("Incorrect CNIC","Please Enter CNIC in this format XXXXX-XXXXXXX-X");
      return;
    }
    // try {
    //   value = await AsyncStorage.getItem('@device_id')
    //   console.log(`Device id ${value===null?'Dosen\'t Exist':'Exists = ' }` , value)
    //   if(value === null) {
    //     OneSignal.getDeviceState().then(async(x)=>{
    //       console.log(x)
    //       await AsyncStorage.setItem('@device_id', x.userId)
    //       value = x.userId
    //     })
    //   }
    // } catch(e) { console.log(e) }
    // if(num.length==10 && pass.length>5 && value!==null){
    //   setLoad(true)
    //   console.log(num, pass, value)
    //   axios.post(API.vendorLogin,{
    //     contact:num,
    //     password:pass,
    //     device_id:value
    //   }).then((x)=>{
    //       console.log(x.data)
    //       if(x.data.status=="Success"){
    //         setValues(x.data.token)
    //       }else{
    //         setLoad(false)
    //         Alert.alert("Error Signing In", "Invalid Number or Password")
    //       }
    //   })
    // }
    // if(value===null){ handleSubmit(); }
    // if(num.length!=10){
    //     Alert.alert("Invalid Input","Contact Required");
    //     return
    // }
    // if(pass.length<5){
    //     Alert.alert("Invalid Input",'Atleast 6 Letters in Password!')
    //     return
    // }
  }

  const login = () => {
    setLoad(true);
    console.log(email);
    console.log(code);
    if(code.length>5){
      setTimeout(
        async function() {
          console.log('function hit')
          await axios.post(API.GetAccountVerification,{ email:email, pass:code, type:"shopowner"})
          .then((x)=>{
            console.log(x.data);
            if(x.data.message=='Invalid'){
              setLoad(false);
              Alert.alert("Please Try Again","Please Enter the 6 Digit Code recieved on E-mail Correctly!");
            }else if(x.data.message=='Success'){
              setValues(x.data.token);
            }
          })
      }, 3000);
    }
    if(code.length<6){
      Alert.alert("Error","Please Enter the 6 Digit Code recieved on E-mail Correctly!");
      setLoad(false);
    }
  }

  const setValues = async(token) => {
    let values = jwt_decode(token)
    console.log(values)
    await AsyncStorage.setItem('@vendor_id', values.loginId)
    await AsyncStorage.setItem('@token', token)
    await AsyncStorage.setItem('@username', values.username)
    await AsyncStorage.setItem('@email', values.email)
    setLoad(false)
    navigation.navigate("Home")
  }

  return (
    <View style={{flex:1, paddingLeft:40, paddingRight:40, paddingTop:50, backgroundColor:'white'}}>
      <Image
        style={{height:155, width:210, position:'absolute', top:-20, right:-60}}
        source={require('../../assets/images/iconpngs/asset1.png')}
      />
      {!load &&
      <View style={{paddingBottom:30}}>
        <ScrollView>
            {/* Login Form */}
        {!codeScreen && 
        <>  
          <Text style={{fontSize:40, fontWeight:'bold', color:'#101111' }}>Sign Up</Text>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={[styles.input]} value={f_name} placeholder='First Name' onChangeText={(x)=>setF_name(x)} />

          <Text style={styles.label}>Last Name</Text>
          <TextInput style={[styles.input]} value={l_name} placeholder='Last Name' onChangeText={(x)=>setL_name(x)} />

          <Text style={styles.label}>Email Address</Text>
          <TextInput style={[styles.input]} value={email} placeholder='Email' onChangeText={(x)=>setEmail(x)} />

          <Text style={styles.label}>Mobile No.</Text>
          <TextInput style={[styles.input]} value={contact} placeholder='Mobile' keyboardType='numeric' onChangeText={(x)=>setContact(x)} />

          <Text style={styles.label}>CNIC</Text>
          <TextInput style={[styles.input]} value={cnic} placeholder='xxxxx-xxxxxxx-x' keyboardType='numeric' onChangeText={(x)=>setCnic(x)} />

          <View style={{marginTop:18, flexDirection:'row'}}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={()=>{navigation.navigate("Login")}}>
              <Text style={{color:'#1A6DBB', fontWeight:'bold'}}>
                Login
              </Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>handleSubmit()}><Text style={[styles.btn,{ marginTop:20 }]}>Submit</Text></TouchableOpacity>
        </>
        }
        {/* Code Form */}
        {codeScreen &&
        <>
          <Text style={{fontSize:30, fontWeight:'bold', color:'#171111', marginTop:100}}>Enter Code </Text>
          <Text style={{fontWeight:'normal', color:'grey', marginBottom:0, marginBottom:6, marginTop:0 }}>
            Enter The Code Recieved On Your Email
          </Text>
          <TextInput style={[styles.input]} value={code} placeholder='Your Code Here' keyboardType='numeric' onChangeText={(x)=>setCode(x)} />
          <View style={{marginTop:10, flexDirection:'row'}}>
            <Text>Didn't Recieved The Code Yet? </Text>
            <TouchableOpacity onPress={()=>{setCodeScreen(false)}}>
              <Text style={{color:'#1A6DBB', fontWeight:'bold'}}>
                Try Again
              </Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>login()}><Text style={[styles.btn]}>Submit</Text></TouchableOpacity>
        </>
        }
        </ScrollView>
      </View>
      }
      {load &&
        <View style={{alignItems:'center', marginTop:300}}>
          <ActivityIndicator size={'large'} color={'#1A6DBB'} />
          <Text>Please Wait</Text>
        </View>
      }
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
    input: {
      marginLeft:5,
      marginRight:5,
      fontSize:17,
      height: 60,
      borderRadius:10,
      borderColor:'white',
      borderWidth: 1,
      paddingLeft:20,
      backgroundColor:'white',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 5,
    },
    btn:{
      marginTop:10,
      fontSize:16,
      color:'white',
      fontWeight:'bold',
      backgroundColor:'#1A6DBB',
      paddingTop:10,
      paddingBottom:10,
      paddingLeft:45,
      paddingRight:45,
      borderRadius:40,
      alignSelf:'flex-end'
    },
    label:{
        fontWeight:'normal', color:'grey', marginBottom:6, marginTop:10
    }
})