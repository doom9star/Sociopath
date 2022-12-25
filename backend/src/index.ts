import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import SocketIO from "socket.io";

import { Utils } from "./ts/utils";
import MainRouter from "./routes";
import { IOAuthenticate } from "./ts/middlewares";
import { IORouter } from "./io";

(async (): Promise<void> => {
  await createConnection();
  const app = express();

  app.use(cors({ credentials: true, origin: process.env.WEB_URL }));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use("/", MainRouter);

  const httpServer = http.createServer(app);
  const IO = new SocketIO.Server(httpServer, {
    cors: { credentials: true, origin: process.env.WEB_URL },
  });
  IO.use(IOAuthenticate);
  IORouter(IO as any);

  httpServer.listen(process.env.PORT, () => {
    Utils.log(`Server started at port ${process.env.PORT}`, "INFO");
  });
})();
