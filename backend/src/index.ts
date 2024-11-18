import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import "reflect-metadata";
import SocketIO from "socket.io";
import { createConnection } from "typeorm";

import { IORouter } from "./io";
import MainRouter from "./routes";
import { IOAuthenticate } from "./ts/middlewares";
import { Utils } from "./ts/utils";

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const main = async () => {
  await createConnection();
  const app = express();

  app.use(cors({ credentials: true, origin: process.env.FRONTEND }));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use("/", MainRouter);

  const httpServer = http.createServer(app);
  const IO = new SocketIO.Server(httpServer, {
    cors: { credentials: true, origin: process.env.FRONTEND },
  });
  IO.use(IOAuthenticate);
  IORouter(IO as any);

  httpServer.listen(process.env.PORT, () => {
    Utils.log(`Server started at port ${process.env.PORT}`, "INFO");
  });
};

main();
