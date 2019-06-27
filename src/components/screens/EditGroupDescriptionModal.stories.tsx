import { storiesOf } from "@storybook/react";

import { screenStory } from "../../__stories__/storyWrapper";

import EditGroupDescriptionModal from "./EditGroupDescriptionModal";

storiesOf("screens/EditGroupDescriptionModal", module).add("Standard", screenStory(EditGroupDescriptionModal));
