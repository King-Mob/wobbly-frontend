import { storiesOf } from "@storybook/react";
import React from "react";

import { withMockClient } from "../../__stories__/MockClient";
import { screenWrapper } from "../../__stories__/ScreenWrapper";
import { someId, someSequence, someThread } from "../../__stories__/testData";
import { actionFactory } from "../../__stories__/util";

import ThreadsList from "./ThreadsList";

storiesOf("organisms/ThreadsList", module)
  .addDecorator(withMockClient())
  .addDecorator(screenWrapper())
  .add("Standard", () => (
    <ThreadsList onPressFactory={actionFactory("press")} groupId={someId()} threads={someSequence(5, someThread)} />
  ));