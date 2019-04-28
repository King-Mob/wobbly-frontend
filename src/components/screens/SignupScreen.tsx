import { Formik, FormikProps } from "formik";
import { get, values } from "lodash";
import * as React from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import SentryExpo from "sentry-expo";
import * as yup from "yup";

import { GENERIC_ERROR_TEXT } from "../../constants";
import { SIGNUP_MUTATION, SignupMutation, SignupMutationFn, SignupMutationResult } from "../../graphql/mutations";
import { createNavigatorFunction, saveTokenAndRedirect } from "../../util";
import { FormErrors, FormField, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import WobblyText from "../atoms/WobblyText";

interface ISignupFormFields {
  email: string;
  displayName: string;
  password: string;
  passwordConfirmation: string;
}

interface ISignupFormProps {
  signup: SignupMutationFn;
  result: SignupMutationResult;
}

class SignupForm extends React.PureComponent<ISignupFormProps> {
  private signupForm?: Formik<ISignupFormFields> | null;

  public componentDidUpdate() {
    const { data } = this.props.result;
    if (data && data.signup.token) {
      saveTokenAndRedirect(data.signup.token);
    }
  }

  public render() {
    const isSigningUp = this.props.result && this.props.result.loading;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.welcome}>
        <WobblyText title2={true} style={styles.welcomeHeading}>
          Sign up
        </WobblyText>
        <Formik
          ref={el => (this.signupForm = el)}
          initialValues={{ email: "", displayName: "", password: "", passwordConfirmation: "" }}
          onSubmit={this.processSignup}
          validateOnChange={false}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email("Invalid email")
              .required("Email is required"),
            displayName: yup
              .string()
              .min(3, "Name must be more than 3 characters")
              .max(50, "Name must be fewer than 50 characters")
              .required("A display name is required"),
            password: yup
              .string()
              .min(10, "Password must be at least 10 characters")
              .required("Password is required"),
            passwordConfirmation: yup
              .string()
              .oneOf([yup.ref("password")], "Passwords do not match")
              .required("Password confirmation is required")
          })}
        >
          {(formikBag: FormikProps<ISignupFormFields>) => (
            <View>
              <FormErrors errors={values(formikBag.errors)} />
              <FormField
                onChangeText={formikBag.handleChange("email")}
                value={formikBag.values.email}
                autoCapitalize="none"
                placeholder="Email"
                keyboardType="email-address"
              />
              <FormField
                onChangeText={formikBag.handleChange("displayName")}
                autoCapitalize="none"
                value={formikBag.values.displayName}
                placeholder="Display name"
              />
              <FormField
                onChangeText={formikBag.handleChange("password")}
                autoCapitalize="none"
                value={formikBag.values.password}
                secureTextEntry={true}
                placeholder="Password"
              />
              <FormField
                onChangeText={formikBag.handleChange("passwordConfirmation")}
                autoCapitalize="none"
                value={formikBag.values.passwordConfirmation}
                secureTextEntry={true}
                placeholder="Confirm password"
              />
              <WobblyButton
                text="Sign up"
                isLoading={isSigningUp}
                intent={Intent.PRIMARY}
                onPress={formikBag.handleSubmit}
                disabled={isSigningUp}
              />
              <WobblyButton
                text="Cancel"
                onPress={createNavigatorFunction("Welcome")}
                disabled={isSigningUp}
                minimal={true}
              />
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );
  }

  private processSignup = (vals: ISignupFormFields) => {
    this.props
      .signup({
        variables: {
          email: vals.email,
          password: vals.password,
          name: vals.displayName
        }
      })
      .catch(e => {
        let error = get(e, "graphQLErrors[0].message");
        if (!error) {
          error = GENERIC_ERROR_TEXT;
          SentryExpo.captureException(e);
        }
        this.signupForm!.setErrors({ email: error });
      });
  };
}

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

export default () => (
  <SignupMutation mutation={SIGNUP_MUTATION}>
    {(signup, result) => <SignupForm signup={signup} result={result} />}
  </SignupMutation>
);
