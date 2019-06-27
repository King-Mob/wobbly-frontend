import { storiesOf } from "@storybook/react";
import React from "react";

import { screenWrapper } from "../../__stories__/storyWrapper";

import DrawerNav from "./DrawerNav";

storiesOf("molecules/DrawerNav", module)
  .addDecorator(screenWrapper())
  .add("Standard", () => <DrawerNav />);
