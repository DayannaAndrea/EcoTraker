import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FoodRegisterScreen from "../screens/FoodRegisterScreen";
import TravelRegisterScreen from "../screens/TravelRegisterScreen";
import RankingScreen from "../screens/RankingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FoodRegister" component={FoodRegisterScreen} />
      <Stack.Screen name="TravelRegister" component={TravelRegisterScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
    </Stack.Navigator>
  );
}
