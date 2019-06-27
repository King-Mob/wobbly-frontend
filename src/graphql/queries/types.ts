import { Query, QueryResult } from "react-apollo";

import { getCurrentGroupId } from "../../generated/getCurrentGroupId";
import { getGroupDetails } from "../../generated/getGroupDetails";
import { getGroups } from "../../generated/getGroups";
import { getOwnInfo } from "../../generated/getOwnInfo";
import { getPosts, getPostsVariables } from "../../generated/getPosts";
import { getPublicGroupDetails, getPublicGroupDetailsVariables } from "../../generated/getPublicGroupDetails";
import { getThreads, getThreadsVariables } from "../../generated/getThreads";

// tslint:disable:max-classes-per-file

export class OwnInfoQuery extends Query<getOwnInfo> {}
export type OwnInfoQueryResult = QueryResult<getOwnInfo>;

export class GroupsQuery extends Query<getGroups> {}
export type GroupsQueryResult = QueryResult<getGroups>;

export class CurrentGroupIdQuery extends Query<getCurrentGroupId> {}
export type CurrentGroupIdQueryResult = QueryResult<getCurrentGroupId>;

export class GroupDetailsQuery extends Query<getGroupDetails> {}
export type GroupDetailsQueryResult = QueryResult<getGroupDetails>;

export class GetPublicGroupDetailsQuery extends Query<getPublicGroupDetails, getPublicGroupDetailsVariables> {}
export type GetPublicGroupDetailsQueryResult = QueryResult<getPublicGroupDetails, getPublicGroupDetailsVariables>;

export class ThreadsQuery extends Query<getThreads, getThreadsVariables> {}
export type ThreadsQueryResult = QueryResult<getThreads, getThreadsVariables>;

export class PostsQuery extends Query<getPosts, getPostsVariables> {}
export type PostsQueryResult = QueryResult<getPosts, getPostsVariables>;
