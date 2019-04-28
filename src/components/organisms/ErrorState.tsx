import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";

import { GENERIC_ERROR_TEXT } from "../../constants";
import { NonIdealState } from "../molecules";

interface IErrorStateProps {
  title?: string;
  subtitle?: string;
}
const ErrorState: React.FC<IErrorStateProps> = ({ title, subtitle }) => (
  <NonIdealState
    title={title || GENERIC_ERROR_TEXT}
    subtitle={subtitle}
    IconFamily={MaterialIcons}
    iconName="error-outline"
  />
);
export default ErrorState;
