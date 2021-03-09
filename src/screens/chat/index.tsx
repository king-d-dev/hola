import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from "react-native";
import { RouteProp } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Ably from "ably";
import { DateTime } from "luxon";
import { LogBox } from "react-native";

import { MainFlowStackParamList } from "../../navigation";
import { Chat, User } from "../..//types";
import { ABLY_API_KEY } from "../../constants/";
import server from "../..//apis/server";
import Message from "./message";

type ScreenProps = {
  route: RouteProp<MainFlowStackParamList, "Chat">;
};

const ably = new Ably.Realtime(ABLY_API_KEY);

LogBox.ignoreLogs(["Setting a timer"]);

export default function ChatScreen({ route }: ScreenProps) {
  const { room } = route.params;
  const channelRef = useRef<Ably.Types.RealtimeChannelCallbacks>(ably.channels.get(room.id));
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<User | null>(null);

  async function sendMessage() {
    const sentAt = DateTime.now().toString();

    setChats([{ room, message, sentAt, sender: user!, id: String(Math.random() * Math.random()) }, ...chats]);
    try {
      await server.post("/chats/add", { message, room: room.id, sentAt });
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
    setMessage("");
  }

  useEffect(() => {
    async function init() {
      const user = await AsyncStorage.getItem("user");
      setUser(JSON.parse(user!));

      const { data } = await server.get<{ chats: Chat[] }>(`/rooms/${room.id}/chats`);
      setChats(data.chats);
    }

    init();
  }, []);

  useEffect(() => {
    const channel = channelRef.current;

    channel.subscribe("new-msg", (msg) => {
      const data = msg.data;

      //   do not update local state if this client is the sender since they already have this message in their local state even before sending it to the server
      if (data.sender.id === user!.id) return;

      setChats([data, ...chats]);
    });

    return () => channel.unsubscribe();
  }, [chats]);

  if (!chats || !user) return null;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 18, marginBottom: 54 }}>
        <FlatList
          data={chats}
          inverted
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }: { item: Chat }) => <Message user={user} chat={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={true}
          placeholder="start typing here..."
          value={message}
          onChangeText={(text) => setMessage(text.trim())}
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity
          onPress={sendMessage}
          disabled={!message.trim()}
          style={{
            marginLeft: 10,
            backgroundColor: "#50b4f3",
            width: 40,
            height: 40,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 50,
    borderColor: "#50b4f3",
    backgroundColor: "#fff",
    borderWidth: 1,
    width: "80%",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  inputContainer: {
    flexDirection: "row",
    // backgroundColor: "blue",
    position: "absolute",
    width: "100%",
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 2,
    paddingBottom: 14,
    justifyContent: "center",
  },
});
