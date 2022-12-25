import { NextFunction, Request, Response } from "express";
import { Utils } from "./utils";
import { AuthIORequest, AuthRequest } from "./types";
import { v2 } from "cloudinary";
import cookie from "cookie";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) return res.json(Utils.getResponse(401));
  const payload = Utils.getAuthPayload(req.cookies.token);
  if (!payload) return res.json(Utils.getResponse(401));
  req.user = payload;
  next();
};

export const cloudinary = (_: Request, __: Response, next: NextFunction) => {
  v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  next();
};

export const IOAuthenticate = (
  socket: AuthIORequest,
  next: (err?: any) => void
) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie as string);
  if (!cookies || !cookies.token) return socket.disconnect(true);
  const payload = Utils.getAuthPayload(cookies.token);
  if (!payload) return socket.disconnect(true);
  socket.handshake.user = payload;
  next();
};
