import { StyleSheet, Text, View, Alert, ActivityIndicator, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import API from '../../apis/index.json';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const Login = ({navigation}) => {

  const [codeScreen, setCodeScreen] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [load, setLoad] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
    getLoginVerification();
    return () => { setEmail(''); setCode(''); setLoad(false); setCodeScreen(false); }
    }, [])
  );

  async function getLoginVerification(){
    let token = await AsyncStorage.getItem('@token')
    console.log('==============> Token', token)
    if(token==null){
      setLoad(false);
    }else{
      navigation.navigate("Home")
    }
    // await axios.get(API.GetUserTokenVerification,{
    //   headers:{"x-access-token":`${token}`}
    // }).then((x)=>{
    //   if(x.data.isLoggedIn==true){
    //     navigation.navigate("Home")
    //   }else{
    //     setLoad(false);
    //   }
    // })
  }

  const handleSubmit = () => {
    setLoad(true);
    if(email.length>10){
      setTimeout(
        async function() {
          await axios.post(API.PostAccountLogin,{ email:email, type:"shopowner"})
          .then((x)=>{
            console.log(x.data);
            if(x.data.status=='error'){
              setLoad(false);
              Alert.alert("Please Try Again","Email Dosen't Exists");
            }else if(x.data.status=='success'){
              setCodeScreen(true);
              setLoad(false);
            }
          })
      }, 3000);
    }
    if(email.length<11){
      Alert.alert("Email Error","Please Enter a valid email");
      setLoad(false);
    }
  }

  const login = () => {
    setLoad(true);
    console.log(email);
    console.log(code);
    if(code.length>5){
      setTimeout(
        async function() {
          await axios.post(API.GetAccountVerification,{ email:email, pass:code, type:"shopowner"})
          .then((x)=>{
            console.log(x.data);
            if(x.data.message=='Invalid'){
              setLoad(false);
              Alert.alert("Please Try Again","Please Enter the 6 Digit Code recieved on E-mail Correctly!");
            }else if(x.data.message=='Success'){
              console.log('DATA---',x.data)
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
    console.log('------',values)
    await AsyncStorage.setItem('@vendor_id', values.loginId)
    await AsyncStorage.setItem('@token', token)
    await AsyncStorage.setItem('@username', values.username)
    await AsyncStorage.setItem('@email', values.email)
    setLoad(false)
    navigateHome()
  }
  async function navigateHome(){
    navigation.navigate("Home")
  }
  
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
      <Image
        style={{height:155, width:210, position:'absolute', top:-20, right:-60}}
        source={require('../../assets/images/iconpngs/asset1.png')}
      />
      {!load &&
      <View style={{width:'80%'}}>
        {/* Login Form */}
        {!codeScreen && 
        <>
          <Text style={{fontSize:40, fontWeight:'bold', color:'#171111' }}>Login</Text>
          <Text style={{fontWeight:'normal', color:'grey', marginBottom:0, marginBottom:6, marginTop:0 }}>Please sign to continue</Text>
          <TextInput style={[styles.input]} value={email} placeholder='Enter Your Email' onChangeText={(x)=>setEmail(x)} />
          <View style={{marginTop:10, flexDirection:'row'}}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('SignUp')}}>
              <Text style={{color:'#1A6DBB', fontWeight:'bold'}}>
                Sign Up
              </Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>handleSubmit()}><Text style={[styles.btn]}>Login</Text></TouchableOpacity>
        </>
        }
        {/* Code Form */}
        {codeScreen &&
        <>
          <Text style={{fontSize:30, fontWeight:'bold', color:'#171111' }}>Enter Code </Text>
          <Text style={{fontWeight:'normal', color:'grey', marginBottom:0, marginBottom:6, marginTop:0 }}>
            Enter The Code Recieved On Your Email
          </Text>
          <TextInput style={[styles.input]} value={code} placeholder='Your Code Here' keyboardType='numeric' onChangeText={(x)=>setCode(x)} />
          <View style={{marginTop:10, flexDirection:'row'}}>
            <Text>Didn't Recieved The Code Yet? </Text>
            <TouchableOpacity onPress={()=>{}}>
              <Text style={{color:'#1A6DBB', fontWeight:'bold'}}>
                Try Again
              </Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>login()}><Text style={[styles.btn]}>Submit</Text></TouchableOpacity>
        </>
        }
      </View>
      }
      {load &&
        <View>
          <ActivityIndicator size={'large'} color={'#1A6DBB'} />
          <Text>Please Wait</Text>
        </View>
      }
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    input: {
      margin:0,
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
    }
})