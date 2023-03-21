import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = ({drawerState,navigation}) => {

    const[username, setUserName] = useState("");
    const[Email, setEmail] = useState("");

    useEffect(() => {
        if(drawerState==true){
            openDrawer()
        }else{
            closeDrawer()
        }
        getVendorDetails()
    }, [drawerState])


    async function getVendorDetails (){
        let vendor_name = await AsyncStorage.getItem('@username')
        let vendor_email = await AsyncStorage.getItem('@email')
        
        setEmail(vendor_email)
        setUserName(vendor_name)
    }
 
    async function LogoutUser () {
       await AsyncStorage.clear()
       navigation.navigate("Login")
    }

    const translation = useRef(new Animated.Value(0)).current;
    const openDrawer = () => {
        Animated.timing(translation,{
            toValue:400,
            duration: 300,
            easing: Easing.in,
            useNativeDriver:true
        }).start();
    }
    const closeDrawer = () => {
        Animated.timing(translation,{
            toValue:-580,
            duration: 200,
            useNativeDriver:true
        }).start();
    }

  return (
    <Animated.View 
    style={{
        backgroundColor:'#1A6DBB',position:'absolute',zIndex:1,height:'100%',width:'80%',
        transform:[{translateX:translation}],left:-400
    }}>
        <View style={{marginLeft:15, marginTop:30, paddingRight:50}}>
            <Text style={{ color:'white',fontSize:24, fontFamily:'Inter-Black' }}
            >{username}</Text>
            <Text style={{ color:'white',fontSize:14, fontFamily:'Inter-Medium' }}
            >{Email}</Text>
        </View>
        <View
            style={{
                marginTop:20,
                borderBottomColor: 'white',
                borderBottomWidth: 1
            }}
        />
        <View style={{marginTop:40, paddingLeft:20}}>

        <TouchableOpacity onPress={()=>navigation.navigate("Profile")} style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom:15}}>
            <EvilIcons name="user" style={styles.menuIconProfile} />
            <Text style={styles.menuFonts}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Orders")} style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom:15}}>
            <Entypo name="list" style={styles.menuIconOrders} />
            <Text style={styles.menuFonts}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Orders")} style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom:15}}>
            <AntDesign name="questioncircleo" style={styles.menuIconHelpCenter} />
            <Text style={styles.menuFonts}>Help Center</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=>navigation.navigate("Settings")} style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom:15}}>
            <Ionicons  name="settings-sharp" style={styles.menuIconSettings} />
            <Text style={styles.menuFonts}>Settings</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={()=>LogoutUser()} style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom:15}}>
            <AntDesign  name="logout" style={styles.menuIconSettings} />
            <Text style={styles.menuFonts}>Logout</Text>
        </TouchableOpacity>

        </View>
    </Animated.View>
  )
}

export default Drawer
const styles = StyleSheet.create({
    menuFonts:{
        color:'white',
        fontSize:20,
        marginTop:6,
        fontFamily:'Inter-Medium'
    },
    menuIconProfile:{
        marginTop:7,
        marginRight:5,
        fontSize:30,
        color:'white'
    },
    menuIconOrders:{
        marginTop:5,
        marginRight:5,
        fontSize:30,
        color:'white'
    
    },
    menuIconHelpCenter:{
        marginTop:7,
        marginRight:9,
        fontSize:25,
        color:'white'
    
    },
    menuIconSettings:{
        marginTop:7,
        marginRight:9,
        fontSize:25,
        color:'white'
    },
    mainScreens:{
        width:130,
        height:130,
        backgroundColor:'#1A6DBB',
        borderRadius:18,
        justifyContent:'center',
        alignItems:'center',
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity:  0.21,
        shadowRadius: 7.68,
        elevation: 10
    },
    mainScreenText:{
        color:'white',
        fontFamily:'Inter-ExtraBold',
        fontSize:35
    }
})