import { Formik, FormikProps } from "formik";
import { get, values } from "lodash";
import * as React from "react";
import { View } from "react-native";
import SentryExpo from "sentry-expo";
import * as yup from "yup";

import { GENERIC_ERROR_TEXT } from "../../constants";
import {
  CONFIRM_EMAIL_MUTATION,
  ConfirmEmailMutation,
  ConfirmEmailMutationFn,
  ConfirmEmailMutationResult
} from "../../graphql/mutations";
import { OWN_INFO_QUERY, OwnInfoQuery, OwnInfoQueryResult } from "../../graphql/queries";
import { WobblyButton } from "../atoms";
import FormErrors from "../atoms/FormErrors";
import FormField from "../atoms/FormField";
import FormLabel from "../atoms/FormLabel";
import { Intent } from "../atoms/WobblyButton";

export interface ISettingsFields {
  confirmationCode: string;
}

interface ISettingsProps {
  confirmEmail: ConfirmEmailMutationFn;
  result: ConfirmEmailMutationResult;
  ownInfoResult: OwnInfoQueryResult;
}

class SettingsScreen extends React.PureComponent<ISettingsProps> {
  public static navigationOptions = {
    title: "Settings"
  };

  private settingsForm?: Formik<ISettingsFields> | null;

  public render() {
    const { ownInfoResult } = this.props;
    const emailConfirmed = get(ownInfoResult, "data.me.emailConfirmed", "");
    return (
      <Formik
        initialValues={{ confirmationCode: "" }}
        ref={el => (this.settingsForm = el)}
        onSubmit={this.handleSubmit}
        validateOnChange={false}
        validationSchema={yup.object().shape({
          confirmationCode: yup.string().required()
        })}
      >
        {(formikBag: FormikProps<ISettingsFields>) => (
          <View>
            <FormErrors errors={values(formikBag.errors)} />
            <FormLabel>Confirm Email</FormLabel>
            <FormField
              disabled={emailConfirmed}
              onChangeText={formikBag.handleChange("confirmationCode")}
              value={formikBag.values.confirmationCode}
            />
            <WobblyButton
              text="Submit"
              intent={Intent.PRIMARY}
              isLoading={this.props.ownInfoResult.loading}
              disabled={emailConfirmed}
              onPress={formikBag.handleSubmit}
            />
          </View>
        )}
      </Formik>
    );
  }

  private handleSubmit = (vals: ISettingsFields) => {
    this.props
      .confirmEmail({
        variables: {
          confirmationCode: vals.confirmationCode
        }
      })
      .catch(e => {
        let error = get(e, "graphQLErrors[0].message");
        if (!error) {
          error = GENERIC_ERROR_TEXT;
          SentryExpo.captureException(e);
        }
        this.settingsForm!.setErrors({ confirmationCode: error });
      });
  };
}

export default () => (
  <OwnInfoQuery query={OWN_INFO_QUERY}>
    {ownInfoResult => (
      <ConfirmEmailMutation mutation={CONFIRM_EMAIL_MUTATION}>
        {(confirmEmail, result) => (
          <SettingsScreen ownInfoResult={ownInfoResult} confirmEmail={confirmEmail} result={result} />
        )}
      </ConfirmEmailMutation>
    )}
  </OwnInfoQuery>
);
