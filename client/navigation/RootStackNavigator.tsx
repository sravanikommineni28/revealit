import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import CompareScreen from "@/screens/CompareScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  Compare: {
    beforeUri: string;
    afterUri: string;
    beforeWidth: number;
    beforeHeight: number;
    afterWidth: number;
    afterHeight: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Compare"
        component={CompareScreen}
        options={{
          headerTitle: "Comparison",
        }}
      />
    </Stack.Navigator>
  );
}
