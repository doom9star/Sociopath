import { AuthPayload, IJsonResponse } from "../ts/types";
import URIParser from "datauri/parser";
import path from "path";
import SocketIO from "socket.io";
import jwt from "jsonwebtoken";

export namespace Utils {
  type TFormat = "INFO" | "ERROR" | "WARNING";
  export function log(message: string, type: TFormat): void {
    const prefix = `[${type}] `;
    if (type === "ERROR") console.log(prefix + "\x1b[31m%s\x1b[0m", message);
    else if (type === "WARNING")
      console.log(prefix + "\x1b[33m%s\x1b[0m", message);
    else console.log(prefix + "\x1b[36m%s\x1b[0m", message);
  }

  const Responses: Record<number, string> = {
    200: "Request Successfull!",
    201: "Resource Created!",
    401: "Request Unauthorized!",
    404: "Resource Not Found!",
    500: "Internal Server Error!",
    400: "Request Refused!",
  };
  export function getResponse<T = null>(
    status: number,
    body: T = null
  ): IJsonResponse<T> {
    return {
      status,
      message: Responses[status],
      body,
    };
  }

  const parser = new URIParser();
  export function toDataURI(
    fileName: string,
    buffer: Buffer
  ): string | undefined {
    return parser.format(path.extname(fileName), buffer).content;
  }

  export function getAuthPayload(token?: string): AuthPayload | null {
    if (!token) return null;
    try {
      const payload = jwt.verify(token, process.env.SECRET) as AuthPayload;
      return payload;
    } catch {
      return null;
    }
  }

  export class SocketMgr<T> {
    private sockets: Map<T, SocketIO.Socket> = new Map<T, SocketIO.Socket>();
    public add(id: T, socket: SocketIO.Socket): void {
      this.sockets.set(id, socket);
    }
    public get(id: T): SocketIO.Socket | null | undefined {
      return this.has(id) ? this.sockets.get(id) : null;
    }
    public has(id: T): boolean {
      return this.sockets.has(id);
    }
    public remove(id: T): void {
      this.has(id) && this.sockets.delete(id);
    }
    public broadcast(event: string, message: string, ids: T[]): void {
      ids.forEach((id) => {
        const s = this.get(id);
        if (s) s.emit(event, message);
      });
    }
  }
}
