import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";
import { RegisterNodeBody } from "../registry/registry";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  onionRouter.get("/status", (req, res) => {
    res.send("live");
  });

  onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
    /* This route should respond with a JSON payload containing a result
     property containing the last received message in its encrypted form, this should be the value that
      is received by the node in the request. */
    res.json({ result: null});
  });

  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    /* This route should respond with a JSON payload containing a result property containing the last 
    received message in its encrypted form, this should be the value of the data that is forwarded to the next node / user. */
    res.json({ result: null });
  });

  onionRouter.get("/getLastMessageDestination", (req, res) => {
    /* This route should respond with a JSON payload containing a result property containing the destination (port) 
    of the last received message.
     The destination can be a node or user port. */
    res.json({ result: null});
  });


  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
