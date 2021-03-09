import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Alert, FlatList } from "react-native";
import server from "../apis/server";
import Navigation, { MainFlowStackParamList } from "../navigation";
import { Room } from "../types";

type ScreenProps = {
  navigation: StackNavigationProp<MainFlowStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: ScreenProps) {
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    async function getRooms() {
      try {
        const { data } = await server.get<{ rooms: Room[] }>("/rooms");
        setRooms(data.rooms);
      } catch (e) {
        Alert.alert("Oops", e.message);
      }
    }

    getRooms();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <TouchableOpacity>
        <FlatList
          data={rooms}
          keyExtractor={(item, _) => item.id}
          renderItem={({ item }: { item: Room }) => (
            <TouchableOpacity style={{ paddingHorizontal: 5, paddingVertical: 10 }} onPress={() => navigation.navigate("Chat", { room: item })}>
              <Text style={{ fontSize: 20, textTransform: "capitalize" }}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ borderColor: "#eee", borderTopWidth: 1 }} />}
        />
      </TouchableOpacity>
    </View>
  );
}
