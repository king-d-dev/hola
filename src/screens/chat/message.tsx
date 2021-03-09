import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { DateTime } from "luxon";
import { Chat, User } from "../../types";

type MessageProps = {
  user: User;
  chat: Chat;
};

export default function Message({ chat, user }: MessageProps) {
  const fromMe = chat.sender.id === user.id;
  const icon = chat.sender.username[0].toUpperCase();

  const sentAt = DateTime.fromISO(chat.sentAt).toLocaleString(DateTime.TIME_SIMPLE);

  return (
    <View style={!fromMe && { flexDirection: "row", alignItems: "center" }}>
      {!fromMe && (
        <View style={styles.iconContainer}>
          <Text>{icon}</Text>
        </View>
      )}

      <View style={[styles.messageContainer, !fromMe && { backgroundColor: "#cee6f0" }]}>
        <Text style={{ color: fromMe ? "#fff" : "#000" }}>{chat.message}</Text>
        <Text style={styles.time}>{sentAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#147EFB",
    borderRadius: 50,
    maxWidth: "70%",
    alignSelf: "flex-end",
  },
  iconContainer: {
    borderRadius: 50,
    backgroundColor: "yellow",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  time: {
    fontSize: 11,
    marginLeft: 10,
    alignSelf: "flex-end",
    color: "#adb0b3",
  },
});
