import dotenv from "dotenv";
import http from "http";
import { server } from "socket.io";
import jwt from "jsonwebtoken";
dotenv.config({ path: "./config.env" });
import Mongoose from "mongoose";

process.on("uncaughtException", (err) => {
  console.log("unhandled exception 🐦‍🔥: server shutting down");
  console.error(err);
  process.exit(1);
});

Mongoose.connect(process.env.LOCAL_DATABASE).then(() => {
  console.log("db connect successfully");

  startServer();
});

async function startServer() {
  ///////////////////////////!!!!!!!!!!!!!!!!!!!!!!///////////////////////////
  const { default: app } = await import("./app.js");
  ////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!///////////////////////////
  const port = process.env.PORT || 3000;
  const httpServer = http.createServer(app);
  const io = new server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.cookie
        ?.split("; ")
        .find((c) => c.startsWith("accessToken="))
        ?.split("=")[1];
    if (!token) {
      return next(new Error("Authentication error"));
    }
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.user = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);
    console.log(`user ${socket.userId} connected via socket`);
  });
  app.set("io", io);
  const server = httpServer.listen(port, () => {
    console.log(`server running in port ${port}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log("unhandled rejection 🐦‍🔥: server shutting down");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}
