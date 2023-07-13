import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import AuthScreen from "./login-and-signup";

const screens: any = {
  Auth: {
    screen: AuthScreen,
    navigationOptions: {
      header: null,
    },
  },
};

const SignedInStack = createStackNavigator(screens);

export default createAppContainer(SignedInStack);
