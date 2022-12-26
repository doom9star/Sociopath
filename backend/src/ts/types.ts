import { Request } from "express";
import { Socket } from "socket.io";

export type IJsonResponse<T = undefined> = {
  status: number;
  message: string;
  body: T;
};

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

export type FeedType = "public" | "private" | "protected";
export type AuthPayload = { uid: string; pid: string };

export type AuthRequest = Request & { user?: AuthPayload };
export type AuthIORequest = Socket & { handshake: { user?: AuthPayload } };
