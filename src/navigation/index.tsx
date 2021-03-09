import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/home";
import Auth from "../screens/auth";
import Chat from "../screens/chat";
import { Room } from "../types";

export type MainFlowStackParamList = {
  Auth: undefined;
  Home: undefined;
  Chat: { room: Room };
};

const MainFlowStack = createStackNavigator<MainFlowStackParamList>();

export default function Navigation() {
  return (
    <MainFlowStack.Navigator>
      <MainFlowStack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
      <MainFlowStack.Screen name="Home" component={HomeScreen} options={{ title: "Chat Rooms" }} />
      <MainFlowStack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({ title: route.params.room.name, headerTitleStyle: { textTransform: "capitalize" } })}
      />
    </MainFlowStack.Navigator>
  );
}
