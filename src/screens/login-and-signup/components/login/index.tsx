import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../constants/colors";
import { handleLogin, loginResetFields } from "../../function";
import { hideModal, showModal } from "../../../../store/slices/modal";

const LoginJSX = (props: { setAccountType: Function; navigation: any }) => {
  const { navigation, setAccountType } = props;
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPress = () => {
    // Server simulation
    setTimeout(() => {
      handleLogin({
        dispatch,
        password,
        email,
        showModal,
        navigation,
      });
    }, 1000);
  };

  return (
    <View style={{ width: "100%", }}>
      <Text style={styles.titleText}>Login</Text>
      <View>
        <View style={styles.inputContainer}>
          <AntDesign style={styles.icon} name="mail" size={24} />
          <TextInput
            style={styles.textInput}
            onChange={(e) => setEmail(e.nativeEvent.text)}
            autoCapitalize={"none"}
            value={email}
            placeholder="Your email e.g johndoe@email.com"
          ></TextInput>
        </View>

        <View style={styles.inputContainer}>
          <AntDesign style={styles.icon} name="lock" size={24} />
          <TextInput
            style={styles.textInput}
            onChange={(e) => setPassword(e.nativeEvent.text)}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
          ></TextInput>
        </View>

        <TouchableOpacity>
          <Text style={{ ...styles.greyText, color: colors.accent }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity
          onPress={() => handleLoginPress()}
          style={styles.primaryBtn}
        >
          <View style={{ flexDirection: "row" }}>
            <AntDesign
              style={styles.icon}
              name="login"
              size={24}
              color={"white"}
            />
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins_600SemiBold",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Login
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setAccountType("register");
            dispatch(hideModal());
            loginResetFields({ setEmail, setPassword });
          }}
          style={styles.greyBtn}
        >
          <View style={{ flexDirection: "row" }}>
            <AntDesign
              style={styles.icon}
              name="login"
              size={24}
              color={"black"}
            />
            <Text
              style={{
                color: "black",
                fontFamily: "Poppins_600SemiBold",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Create account
            </Text>
          </View>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 50,
  },
  inputContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    alignItems: "center",
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    padding: 10,
    fontSize: 16,
    flex: 1,
    fontFamily: "Poppins_400Regular",
    flexDirection: "row",
    alignItems: "center",
  },
  greyBtn: {
    padding: 12.5,
    backgroundColor: colors.info,
    borderRadius: 15,
    marginVertical: 5,
    alignItems: "center",
  },
  primaryBtn: {
    padding: 12.5,
    backgroundColor: colors.primary,
    borderRadius: 15,
    marginVertical: 5,
    alignItems: "center",
  },
  titleText: {
    fontSize: 36,
    fontFamily: "Poppins_600SemiBold",
    marginVertical: 15,
    textAlign: "left",
  },
  greyText: {
    color: "grey",
    marginVertical: 15,
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  accountText: {
    textAlign: "center",
    marginVertical: 15,
    color: colors.primary,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
});

export default LoginJSX;
