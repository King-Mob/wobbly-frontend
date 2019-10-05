import { storiesOf } from "@storybook/react";

import { screenStory } from "../../__stories__/storyWrapper";

import EditGroupNameModal from "./EditGroupNameModal";

storiesOf("screens/EditGroupNameModal", module).add("Standard", screenStory(EditGroupNameModal));
