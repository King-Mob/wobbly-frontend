import { reverse, sortBy } from "lodash";
import * as React from "react";
import { FlatList } from "react-native";

import { getThreads_threads } from "../../generated/getThreads";
import {
  CURRENT_GROUP_ID_QUERY,
  CurrentGroupIdQuery,
  THREADS_QUERY,
  ThreadsQuery,
  ThreadsQueryResult
} from "../../graphql/queries";
import { createNavigatorFunction } from "../../util";
import { ThreadListItem } from "../molecules";

import { ErrorState, LoadingState } from ".";

interface IThreadsListProps {
  threadsResult: ThreadsQueryResult;
  groupId: string;
}

class ThreadsList extends React.PureComponent<IThreadsListProps> {
  public render() {
    const { threadsResult } = this.props;
    if (threadsResult.loading) {
      return <LoadingState />;
    } else if (threadsResult.error || !threadsResult.data) {
      return <ErrorState />;
    }

    const threads: getThreads_threads[] = threadsResult.data.threads || [];
    let sortedThreads = sortBy(threads, mostRecentlyUpdated);
    sortedThreads = reverse(sortBy(sortedThreads, ["pinned"])); // this is an in-place sort

    return <FlatList data={threadsResult.data.threads} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />;
  }

  private renderItem = ({ item }: { item: getThreads_threads }) => {
    return <ThreadListItem thread={item} groupId={this.props.groupId} onPress={this.onPressFactory(item)} />;
  };

  private keyExtractor = (item: getThreads_threads) => item.id;

  private onPressFactory = (item: getThreads_threads): (() => void) => {
    const { groupId } = this.props;
    return createNavigatorFunction("Thread", { threadId: item.id, threadTitle: item.title, groupId });
  };
}

const mostRecentlyUpdated = (thread: getThreads_threads) => {
  const lastPost = thread.posts[thread.posts.length - 1];
  return lastPost ? new Date(lastPost.createdAt) : FAR_FUTURE;
};

const FAR_FUTURE = new Date("2100-01-01");

const EnhancedComponent = () => (
  <CurrentGroupIdQuery query={CURRENT_GROUP_ID_QUERY}>
    {currentGroupId => {
      const groupId = currentGroupId.data!.currentGroupId!;
      return (
        <ThreadsQuery query={THREADS_QUERY} variables={{ groupId }}>
          {threadsResult => <ThreadsList groupId={groupId} threadsResult={threadsResult} />}
        </ThreadsQuery>
      );
    }}
  </CurrentGroupIdQuery>
);

export default EnhancedComponent;
