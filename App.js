import React from "react";

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, CardStyleInterpolators  } from '@react-navigation/stack';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import StoreScreen from "./components/Screens/StoreScreen";
import HomeScreen from "./components/Screens/HomeScreen";
import HelpCenter from "./components/Screens/HelpCenter";
import CartScreen from "./components/Screens/CartScreen";
import MapsScreen from "./components/Screens/MapsScreen";
import Inventory from "./components/Screens/AllInventory";
import Profile from "./components/Screens/Profile/index";
import SignUp from "./components/Screens/SignUp";
import Sales from "./components/Screens/Sales";
import Login from "./components/Screens/Login";
import ReStock from "./components/Screens/ReStock";
import POSScreen from "./components/Screens/POS";
import InventoryScreen from "./components/Screens/OurInventory";
import ChargeScreen from "./components/Screens/ChargeScreen";
import Invoice from "./components/Screens/Invoice";
import OrderScreen from "./components/Screens/Orders";

const Stack = createStackNavigator();
function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
       }}
      >
        <Stack.Screen name="Home" component={HomeScreen}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Login" component={Login}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="SignUp" component={SignUp}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="StoreScreen" component={StoreScreen}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="MapsScreen" component={MapsScreen}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Inventory" component={Inventory}
          options={{
            headerShown:false,
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="MyInventory" component={InventoryScreen}
          options={{
            headerShown:false,
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Profile" component={Profile}
          options={{
            title: 'My Profile Page',
            headerTitleAlign:'center',
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Sales" component={Sales}
        options={{
          headerShown:false,
          //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        />
        <Stack.Screen name="HelpCenter" component={HelpCenter}
          options={{
            title: 'My Help Center',
            headerTitleAlign:'center',
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Cart" component={CartScreen}
         options={{
          headerShown:false,
          //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        />
        <Stack.Screen name="Charge" component={ChargeScreen}
         options={{
          headerShown:false,
          //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        />
        <Stack.Screen name="POS" component={POSScreen}
         options={{
          headerShown:false,
          //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        />
         <Stack.Screen name="ReStock" component={ReStock}
          options={{
            headerShown:false,
          headerTitleAlign:'center',
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
         <Stack.Screen name="Invoices" component={Invoice}
          options={{
            headerShown:false,
          headerTitleAlign:'center',
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
         <Stack.Screen name="Orders" component={OrderScreen}
          options={{
            headerShown:false,
          headerTitleAlign:'center',
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;