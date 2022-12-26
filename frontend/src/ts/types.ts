export type IJsonResponse<T = undefined> = {
  status: number;
  message: string;
  body: T;
};

export type FeedType = "public" | "private" | "protected";

export enum NotificationType {
  FOLLOW,
  COMMENT,
  REPLY,
  LIKE,
  ADMIN,
}

export enum WorldPostType {
  IMAGE,
  WRITING,
  IMAGE_WRITING,
}

interface Common {
  id: string;
  createdAt: string;
}

export interface IProfile extends Common {
  name: string;
  bio: string | null;
  avatar: IImage | null;
  location: string | null;
  occupation: string | null;
  weblink: string | null;
  isFollowing: boolean;
  followers: number;
  following: number;
}

export interface INotification extends Common {
  type: NotificationType;
  reciever: IProfile;
  creator?: IProfile;
  post?: IPost;
  read: boolean;
}
export interface IPost extends Common {
  body: string | null;
  profile: IProfile;
  images: IImage[];
  likes: number;
  comments: number | IComment[];
  isLiked: boolean;
}

export interface IFollow extends Common {
  profile: IProfile;
  following: IProfile;
  isFollowing?: boolean;
}

export interface ILike extends Common {
  profile: IProfile;
  post: IPost;
  isFollowing?: boolean;
}
export interface IComment extends Common {
  profile: IProfile;
  post: IPost;
  body: string;
  children: IComment[];
  parent: IComment;
}

export interface IImage extends Common {
  url: string;
}
