import { Formik, FormikProps } from "formik";
import hoistNonReactStatics from "hoist-non-react-statics";
import { get, values } from "lodash";
import * as React from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import SentryExpo from "sentry-expo";

import { GENERIC_ERROR_TEXT } from "../../constants";
import { LOGIN_MUTATION, LoginMutation, LoginMutationFn, LoginMutationResult } from "../../graphql/mutations";
import { NavigationService } from "../../services";
import { createNavigatorFunction, registerForPushNotificationsAsync, saveAuthTokenAsync } from "../../util";
import { FormErrors, FormField, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import WobblyText from "../atoms/WobblyText";

export interface ILoginFormFields {
  email: string;
  password: string;
}

interface ILoginScreenProps extends NavigationInjectedProps {
  login: LoginMutationFn;
  result: LoginMutationResult;
}

class LoginScreen extends React.PureComponent<ILoginScreenProps> {
  public static navigationOptions = {
    header: null
  };
  private loginForm?: Formik<ILoginFormFields> | null;

  public componentDidUpdate() {
    const { data } = this.props.result;
    if (data && data.login.token) {
      saveAuthTokenAsync(data.login.token);
    }
  }

  public render() {
    const goToWelcome = createNavigatorFunction("Welcome");
    const isLoggingIn = this.props.result && this.props.result.loading;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.welcome}>
        <WobblyText title2={true} style={styles.welcomeHeading}>
          Login
        </WobblyText>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={this.handleLogin}
          validateOnChange={false}
          ref={el => (this.loginForm = el)}
        >
          {(formikBag: FormikProps<ILoginFormFields>) => (
            <View>
              <FormErrors errors={values(formikBag.errors)} />
              <FormField
                autoCapitalize="none"
                onChangeText={formikBag.handleChange("email")}
                value={formikBag.values.email}
                placeholder="Email"
                keyboardType="email-address"
              />
              <FormField
                autoCapitalize="none"
                onChangeText={formikBag.handleChange("password")}
                value={formikBag.values.password}
                secureTextEntry={true}
                placeholder="Password"
              />
              <WobblyButton
                text="Log in"
                isLoading={isLoggingIn}
                intent={Intent.PRIMARY}
                onPress={formikBag.handleSubmit}
                disabled={isLoggingIn}
              />
              <WobblyButton text="Cancel" onPress={goToWelcome} disabled={isLoggingIn} minimal={true} />
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );
  }

  private handleLogin = (vals: ILoginFormFields) => {
    this.props
      .login({
        variables: {
          email: vals.email,
          password: vals.password
        }
      })
      .then(result => {
        const token = get(result, "data.login.token", undefined);
        if (!token) {
          throw new Error("Did not receive auth token");
        }
        return saveAuthTokenAsync(token);
      })
      .then(() => {
        return registerForPushNotificationsAsync();
      })
      .then(() => {
        NavigationService.navigate("GroupsList");
      })
      .catch(e => {
        let error = get(e, "graphQLErrors[0].message");
        if (!error) {
          error = GENERIC_ERROR_TEXT;
          SentryExpo.captureException(e);
        }
        this.loginForm!.setErrors({ email: error });
      });
  };
}

const EnhancedComponent = ({ navigation }: NavigationInjectedProps) => (
  <LoginMutation mutation={LOGIN_MUTATION}>
    {(login, result) => <LoginScreen login={login} result={result} navigation={navigation} />}
  </LoginMutation>
);

export default hoistNonReactStatics(EnhancedComponent, LoginScreen);

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around"
  },
  welcomeHeading: {
    textAlign: "center",
    marginBottom: 10
  }
});
