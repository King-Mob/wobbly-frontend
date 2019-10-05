import gql from "graphql-tag";

import { postListDetailsFragment, threadListDetailsFragment } from "../fragments";

export const OWN_INFO_QUERY = gql`
  query getOwnInfo {
    me {
      id
      name
      email
      emailConfirmed
    }
  }
`;

export const GROUPS_QUERY = gql`
  query getGroups {
    groups {
      id
      name
      memberCount
    }
  }
`;

export const CURRENT_GROUP_ID_QUERY = gql`
  query getCurrentGroupId {
    currentGroupId @client
  }
`;

export const SEARCH_GROUPS_QUERY = gql`
  query searchGroups($searchQuery: String!) {
    searchGroups(searchQuery: $searchQuery) {
      id
      name
      description
    }
  }
`;

export const PUBLIC_GROUP_DETAILS_QUERY = gql`
  query getPublicGroupDetails($groupId: ID!) {
    group(id: $groupId) {
      id
      name
      description
    }
  }
`;

export const GROUP_DETAILS_QUERY = gql`
  query getGroupDetails($groupId: ID!) {
    group(id: $groupId) {
      id
      name
      description
      members {
        id
        name
      }
    }
  }
`;

export const THREADS_QUERY = gql`
  query getThreads($groupId: ID!) {
    threads(groupId: $groupId) {
      ...ThreadListDetails
    }
  }
  ${threadListDetailsFragment}
`;

export const POSTS_QUERY = gql`
  query getPosts($threadId: ID!) {
    posts(threadId: $threadId) {
      ...PostListDetails
    }
  }
  ${postListDetailsFragment}
`;
