import * as React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";

import { searchGroups, searchGroups_searchGroups } from "../../generated/searchGroups";
import { SEARCH_GROUPS_QUERY } from "../../graphql/queries";
import { NavigationService } from "../../services";
import { colors } from "../../style/common";
import { createNavigatorFunction } from "../../util";
import WobblyText from "../atoms/WobblyText";
import { CreateGroupFooter, SearchBar } from "../molecules";
import { ErrorState, GroupsList, LoadingState } from "../organisms";

interface ISearchGroupsModalProps extends WithApolloClient<{}> {}
interface ISearchGroupsModalState {
  results?: SearchResult;
  loading: boolean;
  query: string;
}

type SearchResult = { status: "error"; error: Error } | { status: "ok"; groups: searchGroups_searchGroups[] };

class SearchGroupsModal extends React.PureComponent<ISearchGroupsModalProps, ISearchGroupsModalState> {
  public static navigationOptions = () => {
    return {
      title: "Search",
      headerRight: <Button type="clear" title="Cancel" onPress={NavigationService.goBack} />
    };
  };

  private static navigateToCreateGroup = createNavigatorFunction("CreateGroup");

  public constructor(props: ISearchGroupsModalProps) {
    super(props);
    this.state = { loading: false, query: "" };
  }

  public render() {
    return (
      <View style={style.container}>
        <SearchBar placeholder="Search for a group..." onSubmit={this.handleSearch} />
        {this.renderContent()}
        {this.renderFooter()}
      </View>
    );
  }

  private renderContent() {
    const { results, loading } = this.state;

    if (loading) {
      return <LoadingState />;
    }

    if (results && results.status === "error") {
      return <ErrorState />;
    }

    if (results && results.status === "ok") {
      if (results.groups.length === 0) {
        return (
          <View style={style.noResultsWrapper}>
            <WobblyText style={style.noResultsText}>No results</WobblyText>
          </View>
        );
      }

      return <GroupsList groups={results.groups} onPressFactory={this.onPressFactory as any} />;
    }

    return null;
  }

  private renderFooter() {
    const { results } = this.state;

    if (results) {
      return <CreateGroupFooter onButtonPress={SearchGroupsModal.navigateToCreateGroup} />;
    }

    return null;
  }

  private handleSearch = (searchQuery: string) => {
    this.setState({ loading: true });
    this.props.client
      .query<searchGroups>({
        query: SEARCH_GROUPS_QUERY,
        variables: { searchQuery }
      })
      .then(response => {
        if (!response.data.searchGroups) {
          return;
        }
        this.setState({
          results: {
            status: "ok",
            groups: response.data.searchGroups
              .filter(group => group && group.name && group.id)
              .map(group => ({
                __typename: "GroupSearchResponse" as "GroupSearchResponse",
                name: group!.name,
                id: group!.id,
                description: group!.description
              }))
          },
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          results: {
            status: "error",
            error
          }
        });
      });
  };

  private onPressFactory = (item: searchGroups_searchGroups): (() => void) => {
    return createNavigatorFunction("JoinGroup", { groupId: item.id, groupName: item.name });
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  noResultsWrapper: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center"
  },
  noResultsText: {
    color: colors.darkGray5
  }
});

export default withApollo(SearchGroupsModal);
