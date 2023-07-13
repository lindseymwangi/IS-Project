import { useEffect, useState } from "react";
import { Image, View, StyleSheet, ScrollView } from "react-native";
import LoginJSX from "./components/login";
import icon from "../../assets/imgs/icon.png";
import RegisterJSX from "./components/register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../constants/colors";

type T = "login" | "register";

const AuthScreen = (props: { navigation: any }) => {
  const { navigation } = props;
  const [accountType, setAccountType] = useState<T>("login");

  const getAuth = async () => {
    const value = await AsyncStorage.getItem("@user");
    if (value) {
      // User has already logged in
    }
  };
  useEffect(() => {
    getAuth();
  }, []);

  const render = () => {
    if (accountType == "login") {
      return (
        <LoginJSX setAccountType={setAccountType} navigation={navigation} />
      );
    }
    return (
      <RegisterJSX setAccountType={setAccountType} navigation={navigation} />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ width: "100%" }}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={icon} />
        </View>
        {render()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 50,
    zIndex: -1,
  },
  imgContainer: {
    width: "100%",
    height: 300,
    alignItems: "center",
  },
  img: {
    width: 250,
    height: 250,
  },
});

export default AuthScreen;
