import * as React from "react";
import { FlatList, SafeAreaView, ScrollView } from "react-native";

import { getGroups_groups } from "../../generated/getGroups";
import {
  CURRENT_GROUP_ID_QUERY,
  CurrentGroupIdQuery,
  CurrentGroupIdQueryResult,
  GROUPS_QUERY,
  GroupsQuery,
  GroupsQueryResult
} from "../../graphql/queries";
import { createNavigatorFunction, switchCurrentGroup } from "../../util";
import { WobblyListItem } from "../atoms/WobblyListItem";
import WobblyText from "../atoms/WobblyText";

import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

interface IDrawerNavProps {
  currentGroupIdResult: CurrentGroupIdQueryResult;
  groupsResult: GroupsQueryResult;
}

class DrawerNav extends React.PureComponent<IDrawerNavProps> {
  public render() {
    const { currentGroupIdResult, groupsResult } = this.props;
    if (currentGroupIdResult.loading) {
      // This should only last a few milliseconds since we're querying local data.
      return null;
    }
    if (groupsResult.loading) {
      return <LoadingState />;
    } else if (groupsResult.error || !groupsResult.data) {
      return <ErrorState />;
    }

    const groups = groupsResult.data.groups || [];

    const keyExtractor = (group: getGroups_groups) => group.id;
    const renderGroupListItem = ({ item }: { item: getGroups_groups }) => {
      const switchGroup = () => switchCurrentGroup(item.id, item.name);
      // TODO: what if no group is selected?
      const isCurrentGroup = item.id === currentGroupIdResult.data!.currentGroupId!;
      return (
        <WobblyListItem
          title={item.name}
          bottomDivider={true}
          onPress={switchGroup}
          containerStyle={(isCurrentGroup && { borderLeftColor: "blue", borderLeftWidth: 5 }) || { marginLeft: 5 }}
        />
      );
    };

    const goToAccount = createNavigatorFunction("Account");
    const goToSearchGroups = createNavigatorFunction("SearchGroups");

    return (
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
        <ScrollView>
          <WobblyText headline={true}>Groups</WobblyText>
          <FlatList
            keyExtractor={keyExtractor}
            renderItem={renderGroupListItem}
            data={groups}
            extraData={currentGroupIdResult.data!.currentGroupId}
          />
          <WobblyListItem
            title="Search/create group"
            onPress={goToSearchGroups}
            leftIcon={{ name: "search" }}
            containerStyle={{ marginLeft: 5 }}
          />
        </ScrollView>

        <WobblyListItem
          key={"account"}
          title="Account"
          topDivider={true}
          leftIcon={{ type: "material", name: "account-circle" }}
          onPress={goToAccount}
        />
      </SafeAreaView>
    );
  }
}

const EnhancedComponent = () => (
  <CurrentGroupIdQuery query={CURRENT_GROUP_ID_QUERY}>
    {currentGroupIdResult => (
      <GroupsQuery query={GROUPS_QUERY}>
        {groupsQueryResult => (
          <DrawerNav groupsResult={groupsQueryResult} currentGroupIdResult={currentGroupIdResult} />
        )}
      </GroupsQuery>
    )}
  </CurrentGroupIdQuery>
);
export default EnhancedComponent;
