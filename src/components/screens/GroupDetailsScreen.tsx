import hoistNonReactStatics from "hoist-non-react-statics";
import { inflect } from "inflection";
import { get, remove } from "lodash";
import * as React from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import HeaderButtons from "react-navigation-header-buttons";

import { getGroups, getGroups_groups } from "../../generated/getGroups";
import {
  LEAVE_GROUP_MUTATION,
  LeaveGroupMutation,
  LeaveGroupMutationFn,
  LeaveGroupMutationResult,
  LeaveGroupMutationUpdaterFn,
  UPDATE_GROUP_MUTATION,
  UpdateGroupMutation,
  UpdateGroupMutationFn,
  UpdateGroupMutationResult
} from "../../graphql/mutations";
import {
  CURRENT_GROUP_ID_QUERY,
  CurrentGroupIdQuery,
  CurrentGroupIdQueryResult,
  GROUP_DETAILS_QUERY,
  GroupDetailsQuery,
  GroupDetailsQueryResult,
  GROUPS_QUERY
} from "../../graphql/queries";
import { NavigationService } from "../../services";
import { EditableTextView, ListSection, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import WobblyText from "../atoms/WobblyText";
import { GroupImage, WobblyHeaderButtons } from "../molecules";
import { ErrorState, LoadingState, PersonList } from "../organisms";

interface IGroupDetailsScreen {
  // Current group ID
  currentGroupId: CurrentGroupIdQueryResult;
  // Group details query
  groupDetails: GroupDetailsQueryResult;
  // Leave group mutation
  leaveGroup: LeaveGroupMutationFn;
  leaveGroupResult: LeaveGroupMutationResult;
  // Update group mutation
  updateGroup: UpdateGroupMutationFn;
  updateGroupResult: UpdateGroupMutationResult;
}
class GroupDetailsScreen extends React.PureComponent<IGroupDetailsScreen> {
  public static navigationOptions = () => {
    return {
      title: "Details",
      headerLeft: (
        <WobblyHeaderButtons>
          <HeaderButtons.Item title="Drawer" iconName="menu" onPress={NavigationService.openDrawer} />
        </WobblyHeaderButtons>
      )
    };
  };

  public render() {
    if (this.props.groupDetails.loading || this.props.currentGroupId.loading) {
      return <LoadingState />;
    } else if (
      this.props.groupDetails.error ||
      !get(this.props.groupDetails, "data.group") ||
      !this.props.currentGroupId.data ||
      !this.props.currentGroupId.data.currentGroupId
    ) {
      return <ErrorState />;
    } else {
      const { currentGroupId } = this.props.currentGroupId.data;
      const group = this.props.groupDetails.data!.group!;
      const members = group.members || [];
      return (
        <ScrollView style={style.container}>
          <GroupImage onPress={this.openEditImageModal} />
          <EditableTextView onPress={this.openEditNameModal(currentGroupId)}>
            <WobblyText title1={true}>{group.name}</WobblyText>
          </EditableTextView>
          <EditableTextView onPress={this.openEditDescriptionModal(currentGroupId)}>
            <WobblyText>{group.description || "Add a description"}</WobblyText>
          </EditableTextView>
          <ListSection>
            <WobblyText listHeading={true}>
              {`${members.length} ${inflect("member", members.length)}`.toUpperCase()}
            </WobblyText>
            <PersonList people={members} />
          </ListSection>
          <WobblyButton text="Leave group" intent={Intent.DANGER} onPress={this.handleLeaveGroup(currentGroupId)} />
        </ScrollView>
      );
    }
  }

  private openEditNameModal = (groupId: string) => {
    return () => NavigationService.navigate("EditGroupName", { groupId });
  };

  private openEditDescriptionModal = (groupId: string) => {
    return () => NavigationService.navigate("EditGroupDescription", { groupId });
  };

  private openEditImageModal = () => {
    // TODO
    return;
  };

  private handleLeaveGroup = (groupId: string) => {
    return () => {
      const leaveGroup = () =>
        this.props.leaveGroup({ variables: { groupId } }).then(() => {
          NavigationService.navigate("GroupsList");
        });
      Alert.alert("Confirm", "Are you sure you want to leave the group?", [
        { text: "Cancel" },
        { text: "Yes", onPress: leaveGroup }
      ]);
    };
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white"
  }
});

const leaveGroupUpdateCache: LeaveGroupMutationUpdaterFn = (cache, { data }) => {
  const prevData = cache.readQuery<getGroups>({ query: GROUPS_QUERY });
  const groups = (prevData && prevData.groups) || [];
  const leftGroupId = data!.leaveGroup.id;
  remove(groups, (group: getGroups_groups) => group.id === leftGroupId);
  cache.writeQuery({
    query: GROUPS_QUERY,
    data: {
      groups
    }
  });
};
const EnhancedComponent = () => (
  <CurrentGroupIdQuery query={CURRENT_GROUP_ID_QUERY}>
    {currentGroupId => {
      const groupId = get(currentGroupId, "data.currentGroupId");
      return (
        <GroupDetailsQuery query={GROUP_DETAILS_QUERY} variables={{ groupId }}>
          {groupDetails => (
            <UpdateGroupMutation mutation={UPDATE_GROUP_MUTATION} variables={{ groupId }}>
              {(updateGroup, updateGroupResult) => (
                <LeaveGroupMutation mutation={LEAVE_GROUP_MUTATION} update={leaveGroupUpdateCache}>
                  {(leaveGroup, leaveGroupResult) => (
                    <GroupDetailsScreen
                      currentGroupId={currentGroupId}
                      groupDetails={groupDetails}
                      leaveGroup={leaveGroup}
                      leaveGroupResult={leaveGroupResult}
                      updateGroup={updateGroup}
                      updateGroupResult={updateGroupResult}
                    />
                  )}
                </LeaveGroupMutation>
              )}
            </UpdateGroupMutation>
          )}
        </GroupDetailsQuery>
      );
    }}
  </CurrentGroupIdQuery>
);
export default hoistNonReactStatics(EnhancedComponent, GroupDetailsScreen);
