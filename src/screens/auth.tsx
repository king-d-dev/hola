import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, GestureResponderEvent, Alert } from "react-native";
import { MainFlowStackParamList } from "../navigation";
import server from "../apis/server";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ScreenProps = {
  navigation: StackNavigationProp<MainFlowStackParamList, "Auth">;
};

type LoginResponse = {
  user: User;
  token: string;
};

export default function AuthScreen({ navigation }: ScreenProps) {
  const [username, setUsername] = useState<string>("");

  async function proceed() {
    try {
      const {
        data: { token, user },
      } = await server.post<LoginResponse>("/auth/login", { username });

      await AsyncStorage.multiSet([
        ["token", token],
        ["user", JSON.stringify(user)],
      ]);

      navigation.replace("Home");
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ marginBottom: 4, fontSize: 16 }}>Your username</Text>
      <TextInput
        autoFocus
        selectionColor="#50b4f3"
        autoCapitalize="none"
        autoCompleteType="username"
        spellCheck={false}
        placeholder="username"
        onSubmitEditing={proceed}
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />

      <TouchableOpacity disabled={!username} style={styles.btn} onPress={proceed}>
        <Text style={{ color: "#fff", textAlign: "center", textTransform: "uppercase" }}>proceed</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { borderColor: "#50b4f3", borderWidth: 1, backgroundColor: "#fff", padding: 5, borderRadius: 4 },
  btn: { backgroundColor: "black", padding: 14, marginTop: 22 },
});
