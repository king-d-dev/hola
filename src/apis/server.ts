import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({ baseURL: "http://192.168.43.227:5000" });

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) config.headers.authorization = token;

  return config;
});

export default instance;
