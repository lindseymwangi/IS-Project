import { hideModal, showModal } from "../../../store/slices/modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../../../store/slices/bottom-nav";

type passwordValidationProps = {
  password: string;
  //confirmPassword: string;
};
export const passwordValid = (props: passwordValidationProps) => {
  const { password } = props;
  const condition1 = password.trim() !== "";
  const condition2 = password.trim().length >= 6;
  if (condition1 && condition2) {
    return true;
  }
  return false;
};

export const emailValid = (email: string) => {
  const regex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
  return regex.test(email);
};

type resetFieldsType = {
  setEmail: Function;
  setPhoneNumber: Function;
  setPassword: Function;
};
export const resetFields = (props: resetFieldsType) => {
  const { setEmail, setPhoneNumber, setPassword } = props;
  setEmail("");
  setPhoneNumber("");
  setPassword("");
};

type loginResetFieldsType = {
  setEmail: Function;
  setPassword: Function;
};
export const loginResetFields = (props: loginResetFieldsType) => {
  const { setEmail, setPassword } = props;
  setEmail("");
  setPassword("");
};

export const notempty = (
  mode: string,
  email: string,
  password: string,
  phoneNumber?: string
) => {
  if (mode === "login") {
    return email.trim() && password.trim();
  }
  return email.trim() && password.trim() && phoneNumber?.trim();
};

export const userInputsNotempty = (
  name: string,
  email: string,
  password: string,
  phoneNumber: string,
  date: string
) => {
  return (
    email.trim() &&
    password.trim() &&
    phoneNumber.trim() &&
    name.trim() &&
    date.trim()
  );
};

const storeUserData = async (value: any, dispatch: any) => {
  try {
    await AsyncStorage.setItem("@user", JSON.stringify(value));
  } catch (e) {
    dispatch(
      showModal({
        type: "error",
        messages: [typeof e === "string" ? e : "Register catch error"],
      })
    );
    setTimeout(() => dispatch(hideModal()), 3000);
  }
};

const deleteUserStoreData = async (dispatch: any) => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    dispatch(
      showModal({
        type: "error",
        messages: [typeof e === "string" ? e : "Register catch error"],
      })
    );
    setTimeout(() => dispatch(hideModal()), 3000);
  }
};

type handleRegisterProps = {
  dispatch: Function;
  showModal: Function;
  email: string;
  password: string;
  phoneNumber: string;
  name: string;
  date?: string;
  navigation: any;
};
export const handleRegister = async (props: handleRegisterProps) => {
  const {
    showModal,
    email,
    password,
    phoneNumber,
    dispatch,
    navigation,
    name,
    date,
  } = props;

  if (!userInputsNotempty(name, email, password, phoneNumber, date!)) {
    dispatch(
      showModal({
        type: "error",
        messages: ["Please fill out every section"],
      })
    );
    setTimeout(() => dispatch(hideModal()), 3000);
    return;
  }

  const passwordValidation = passwordValid({ password });
  const emailValidation = emailValid(email);

  if (passwordValidation && emailValidation) {
    try {
      const res = await fetch("http://10.0.2.2:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          password,
          date,
        }),
      });
      const JsonRes = await res.json();

      if (res.ok) {
        storeUserData(JsonRes.resp, dispatch);
        dispatch(
          showModal({
            type: "success",
            messages: [JsonRes.message],
          })
        );
        setTimeout(() => dispatch(hideModal()), 3000);
        // TODO: Go to the next screen from here
      } else {
        dispatch(
          showModal({
            type: "error",
            messages: [JsonRes.message],
          })
        );
        setTimeout(() => dispatch(hideModal()), 3000);
      }
    } catch (e) {
      console.log(e)
      dispatch(
        showModal({
          type: "error",
          messages: [typeof e === "string" ? e : "Register catch error"],
        })
      );
      setTimeout(() => dispatch(hideModal()), 3000);
    }
  } else {
    if (!passwordValidation && !emailValidation) {
      dispatch(
        showModal({
          type: "error",
          messages: [
            "Please make sure your email address is in a valid format",
            "Please make sure your password is atleast 6 characters long and the confirmation password matches your password",
          ],
        })
      );
      setTimeout(() => dispatch(hideModal()), 3000);
      return;
    }

    if (!emailValidation) {
      dispatch(
        showModal({
          type: "error",
          messages: [
            "Please make sure your email address is in a valid format",
          ],
        })
      );
      setTimeout(() => dispatch(hideModal()), 3000);
      return;
    }
    if (!passwordValidation) {
      dispatch(
        showModal({
          type: "error",
          messages: [
            "Please make sure your confirmation password matches your password",
          ],
        })
      );
      setTimeout(() => dispatch(hideModal()), 3000);
      return;
    }
  }
};

type handleLoginProps = {
  dispatch: Function;
  password: string;
  email: string;
  showModal: Function;
  navigation: any;
};
export const handleLogin = async (props: handleLoginProps) => {
  const { showModal, email, password, dispatch, navigation } = props;
  if (!notempty("login", email, password)) {
    dispatch(
      showModal({
        type: "error",
        messages: ["Please fill out every section"],
      })
    );
    setTimeout(() => dispatch(hideModal()), 3000);
    return;
  }
  if (!emailValid(email)) {
    dispatch(
      showModal({
        type: "error",
        messages: ["Please make sure your email address is in a valid format"],
      })
    );
    setTimeout(() => dispatch(hideModal()), 3000);
    return;
  }
  try {
    const res = await fetch("http://10.0.2.2:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const JsonRes = await res.json();
    if (res.ok) {
      storeUserData(JsonRes.resp, dispatch);
      dispatch(
        showModal({
          type: "success",
          messages: [JsonRes.message],
        })
      );

      setTimeout(() => dispatch(hideModal()), 3000);
      // TODO: Go to the next screen from here
    } else {
      dispatch(
        showModal({
          type: "error",
          messages: [JsonRes.message],
        })
      );
      setTimeout(() => dispatch(hideModal()), 3000);
    }
  } catch (e) {
    console.log(e)
    dispatch(
      showModal({
        type: "error",
        messages: [typeof e === "string" ? e : "Login catch error"],
      })
    );
    setTimeout(() => dispatch(hideModal()), 3000);
  }
};

type handleLogoutProps = {
  dispatch: Function;
  navigation: any;
};
export const handleLogout = async (props: handleLogoutProps) => {
  const { dispatch, navigation } = props;
  try {
    const res = await fetch("http://10.0.2.2:3000/logout");
    const JsonRes = await res.json();

    if (res.ok) {
      dispatch(
        showModal({
          type: "success",
          messages: [JsonRes.message],
        })
      );
      setTimeout(() => dispatch(hideModal()), 3000);
      deleteUserStoreData(dispatch);
      navigation.navigate("Auth");
    } else {
      dispatch(
        showModal({
          type: "error",
          messages: [JsonRes.message],
        })
      );
      setTimeout(() => dispatch(hideModal()), 3000);
    }
  } catch (e) {
    dispatch(
      showModal({
        type: "error",
        messages: [
          typeof e === "string" ? e : "Error logging user/provider out",
        ],
      })
    );
    setTimeout(() => dispatch(hideModal()), 3000);
  }
};
