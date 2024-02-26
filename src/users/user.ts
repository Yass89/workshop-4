import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

   _user.get("/status", (req, res) => {
    res.status(200).send("live");
   });

   _user.get("/getLastReceivedMessage", (req, res) => {
    /* This route should respond with a JSON payload containing a result property containing the last received message of the user*/
    res.status(200).json({ result: null});
  });

  _user.get("/getLastSentMessage", (req, res) => {
    /* This route should respond with a JSON payload containing a result property containing last sent message of the user.*/
    res.status(200).json({ result: null});
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}
