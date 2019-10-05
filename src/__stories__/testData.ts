import { IMessage, User } from "react-native-gifted-chat";

type DataGenerator<T> = (i?: number) => T;

export const someId = (i = 1, prefix = "id") => `${prefix}-${i}`;
export const someDateTime = (day = 0, hour = 0) => new Date(2010, 0, day + 1, hour, 0, 0, 0);
export const someMessageText = (i?: number) => pickOne(messageText, i);
export const someName = (i?: number) => pickOne(people, i).name;
export const someEmail = (i?: number) => someName(i);

export const someUser = (i?: number): User => ({
  _id: someId(i, "user"),
  ...pickOne(people, i)
});

interface IThread {
  __typename: "Thread";
  id: string;
  createdAt: Date;
  title: string;
  pinned: boolean;
  posts: IPost[];
}
export const someThread = (i?: number): IThread => ({
  __typename: "Thread",
  id: someId(i, "thread"),
  title: pickOne(threadTitles, i),
  createdAt: someDateTime(i),
  pinned: false,
  posts: someSequence(listSize(i), somePost, i)
});

interface IPost {
  __typename: "Post";
  id: string;
  author: IPerson;
  content: string;
  createdAt: number | Date;
}
export const somePost = (i?: number): IPost => {
  const message = someGiftedMessage(i);
  return {
    __typename: "Post",
    id: someId(i, "post"),
    author: somePerson(i),
    content: message.text,
    createdAt: message.createdAt
  };
};

interface IPerson {
  __typename: "Person";
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  emailConfirmed: boolean;
  groups: IGroup[];
}
export const somePerson = (i?: number): IPerson => {
  const user = pickOne(people, i);

  return {
    __typename: "Person",
    id: someId(i, "person"),
    createdAt: someDateTime(i),
    name: user.name,
    email: user.name.replace(" ", ".").toLowerCase() + "@example.com",
    emailConfirmed: true,
    groups: []
  };
};

interface IGroup {
  __typename: "Group";
  id: string;
  createdAt: Date;
  name: string;
  description?: string;
  members: IPerson[];
  threads: IThread[];
  memberCount: number;
}
export const someGroup = (i: number = 0): IGroup => ({
  __typename: "Group",
  id: someId(i, "group"),
  ...pickOne(groups, i),
  createdAt: someDateTime(i),
  members: someSequence(listSize(i), somePerson, i),
  threads: someSequence(listSize(i), someThread, i),
  memberCount: listSize(i)
});

export const someGiftedMessage = (i?: number, overrides: Partial<IMessage> = {}): IMessage => ({
  _id: someId(i, "message"),
  text: someMessageText(i),
  createdAt: someDateTime(i),
  user: someUser(i),
  ...overrides
});

export const someImage = (i: number = 0) => images[i];

export const someSequence = <T>(count: number, generator: DataGenerator<T>, seed = 0) => {
  const items: T[] = [];
  for (let i = 0; i < count; ++i) {
    items.push(generator(i + seed));
  }
  return items;
};

const listSize = (seed = 0, min: number = 0, max: number = 3) => {
  const range = max - min;
  return ((seed + (range - 1)) % range) + min;
};
const pickOne = <T>(collection: T[], i = 0) => collection[i % collection.length];

const people = [
  {
    name: "tamsin"
  },
  {
    name: "Skeletor",
    avatar: require("./images/skeletor.png")
  },
  {
    name: "kieran",
    avatar: require("./images/cat.jpg")
  }
];
const threadTitles = ["Fundraising Plans?", "Another thing", "Nov 13th"];
const messageText = [
  "Thanks everyone for being there. Such a good start to the strike. Everyone will be fearless going into tomorrow!",
  "Good luck everyone ✊",
  "Was lovely meeting all you lot. Next time I'm in the city I'll hit this group up"
];
const groups = [
  {
    name: "McDonald's London Road",
    description: "1234x"
  },
  {
    name: "Hanover Outreach",
    description: ""
  },
  {
    name: "Wobbly Developers",
    description: ""
  }
];
const images = [
  // tslint:disable:no-var-requires
  require("./images/400x200.png")
  // tslint:enable:no-var-requires
];
