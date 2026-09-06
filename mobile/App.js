import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigation from "./src/navigation/AppNavigation";
import { ImpactProvider } from "./src/context/ImpactContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ImpactProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </ImpactProvider>
    </SafeAreaProvider>
  );
}
