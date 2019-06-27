import { storiesOf } from "@storybook/react";

import { screenStory } from "../../__stories__/storyWrapper";

import GroupDetailsScreen from "./GroupDetailsScreen";

storiesOf("screens/GroupDetailsScreen", module).add("Standard", screenStory(GroupDetailsScreen));
