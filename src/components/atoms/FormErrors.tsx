import * as React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../style/common";

import WobblyText from "./WobblyText";

interface IFormErrorsProps {
  errors: Array<string | undefined>;
}
const FormErrors: React.SFC<IFormErrorsProps> = ({ errors }) => {
  const filteredErrors = errors.filter(error => !!error) as string[];
  return (
    <View style={style.formErrors}>
      {filteredErrors &&
        filteredErrors.map((error: string, idx: number) => (
          <WobblyText key={`${idx}-${error}`} style={style.formErrorText} callout={true}>
            {error}
          </WobblyText>
        ))}
    </View>
  );
};

const style = StyleSheet.create({
  formErrors: {
    padding: 10
  },
  formErrorText: {
    color: colors.red3
  }
});

export default FormErrors;
