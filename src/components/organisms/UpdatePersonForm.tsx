import { Formik, FormikProps } from "formik";
import { get } from "lodash";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import SentryExpo from "sentry-expo";
import * as yup from "yup";

import { GENERIC_ERROR_TEXT } from "../../constants";
import {
  UPDATE_PERSON_MUTATION,
  UpdatePersonMutation,
  UpdatePersonMutationFn,
  UpdatePersonMutationResult
} from "../../graphql/mutations";
import { OWN_INFO_QUERY, OwnInfoQuery, OwnInfoQueryResult } from "../../graphql/queries";
import { colors } from "../../style/common";
import { FormErrors, FormField, FormLabel, Toast, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";

interface IUpdatePersonFormFields {
  // TODO: profile image
  email: string;
  name: string;
  oldPassword: string;
  newPassword: string;
}

interface IUpdatePersonFormProps {
  updatePerson: UpdatePersonMutationFn;
  updatePersonResult: UpdatePersonMutationResult;
  ownInfoResult: OwnInfoQueryResult;
}

class UpdatePersonForm extends React.Component<IUpdatePersonFormProps> {
  private updatePersonForm?: Formik<IUpdatePersonFormFields> | null;
  private toast: Toast;

  constructor(props: IUpdatePersonFormProps) {
    super(props);
    this.toast = new Toast({});
  }

  public render() {
    const { updatePersonResult, ownInfoResult } = this.props;
    const name = get(ownInfoResult, "data.me.name", "");
    const email = get(ownInfoResult, "data.me.email", "");

    return (
      <Formik
        ref={el => (this.updatePersonForm = el)}
        initialValues={{ email, name, oldPassword: "", newPassword: "" }}
        enableReinitialize={true} // required for `initialValues` to update when the query completes
        onSubmit={this.handleSubmit}
        validateOnChange={false}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name must be fewer than 50 characters")
            .required()
        })}
      >
        {(formikBag: FormikProps<IUpdatePersonFormFields>) => (
          <View>
            <View style={styles.formSection}>
              <FormErrors
                errors={get(this.props.updatePersonResult, "errors.graphQLErrors", []).map(
                  (e: any) => e.message || undefined
                )}
              />
              <FormLabel>Name</FormLabel>
              <FormField onChangeText={formikBag.handleChange("name")} value={formikBag.values.name} />
              <FormLabel>Email</FormLabel>
              <FormField onChangeText={formikBag.handleChange("email")} value={formikBag.values.email} />
              <FormLabel>New Password</FormLabel>
              <FormField
                autoCapitalize="none"
                onChangeText={formikBag.handleChange("newPassword")}
                secureTextEntry={true}
                value={formikBag.values.newPassword}
              />
            </View>
            <View style={styles.formSection}>
              <FormLabel>Current Password (required)</FormLabel>
              <FormField
                autoCapitalize="none"
                onChangeText={formikBag.handleChange("oldPassword")}
                secureTextEntry={true}
                value={formikBag.values.oldPassword}
              />
              <WobblyButton
                text="Submit"
                isLoading={updatePersonResult.loading}
                intent={Intent.PRIMARY}
                onPress={formikBag.handleSubmit}
                disabled={updatePersonResult.loading}
              />
            </View>
            <Toast
              ref={toast => {
                if (toast) {
                  this.toast = toast;
                }
              }}
            />
          </View>
        )}
      </Formik>
    );
  }

  private handleSubmit = (vals: IUpdatePersonFormFields) => {
    const { name, oldPassword, newPassword } = vals;
    this.props
      .updatePerson({
        variables: {
          name,
          newPassword,
          oldPassword
        }
      })
      .then(() => {
        this.toast.show("update successful");
      })
      .catch(e => {
        let error = get(e, "graphQLErrors[0].message");
        if (!error) {
          error = GENERIC_ERROR_TEXT;
          SentryExpo.captureException(e);
        }
        this.updatePersonForm!.setErrors({ name: error });
        this.toast.show(error);
      });
  };
}

export default () => (
  <OwnInfoQuery query={OWN_INFO_QUERY}>
    {ownInfoResult => (
      <UpdatePersonMutation mutation={UPDATE_PERSON_MUTATION}>
        {(updatePerson, updatePersonResult) => (
          <UpdatePersonForm
            updatePerson={updatePerson}
            updatePersonResult={updatePersonResult}
            ownInfoResult={ownInfoResult}
          />
        )}
      </UpdatePersonMutation>
    )}
  </OwnInfoQuery>
);

const styles = StyleSheet.create({
  formSection: {
    paddingBottom: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    borderBottomColor: colors.lightGray1,
    borderBottomWidth: 1
  }
});
