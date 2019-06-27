import { storiesOf } from "@storybook/react";
import React from "react";

import { screenWrapper } from "../../__stories__/storyWrapper";

import ThreadsList from "./ThreadsList";

storiesOf("organisms/ThreadsList", module)
  .addDecorator(screenWrapper())
  .add("Standard", () => <ThreadsList />);
