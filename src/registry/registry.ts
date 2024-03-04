import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

// In-memory store for registered nodes
let nodesRegistry: Node[] = [];


export async function launchRegistry() {
  const registry = express();
  registry.use(express.json());
  registry.use(bodyParser.json());

  registry.get("/status", (req: Request, res: Response) => {
    res.status(200).send("live");
  });

  // POST route for registering a node
  registry.post("/registerNode", (req: Request, res: Response) => {
    const { nodeId, pubKey } = req.body as RegisterNodeBody;

    // Simple validation
    if (typeof nodeId !== 'number' || typeof pubKey !== 'string') {
      return res.status(400).send("Invalid nodeId or pubKey");
    }

    // Check if the node is already registered to prevent duplicates
    const isNodeAlreadyRegistered = nodesRegistry.some(node => node.nodeId === nodeId);
    if (isNodeAlreadyRegistered) {
      return res.status(400).send("Node already registered");
    }

    // Add node to registry
    nodesRegistry.push({ nodeId, pubKey });
    return res.status(201).send("Node registered successfully");
  });

  // GET route for getting the node registry
  registry.get("/getNodeRegistry", (req: Request, res: Response) => {


    // new type for the payload of the get route
    type payload = {
      nodes: {
        nodeId: number;
        pubKey: string;
      }[]
    }
    // Return the list of registered nodes
    const payload: payload = {
      nodes: nodesRegistry
    }
    return res.status(200).json(payload);
  });

  // get the private key of a node
  registry.get("/getPrivateKey", (req: Request, res: Response) => {

    type payload = {
      result: string // string is the base64 version of the private key
    }
    // get the node id from the query
    const nodeId = req.query.nodeId as string;
    // find the node in the registry
    const node = nodesRegistry.find(node => node.nodeId === parseInt(nodeId));
    // if the node is not found
    if (!node) {
      return res.status(404).json({ result: "Node not found" });
    }
    // return the private key
    const payload: payload = {
      result: node.pubKey
    }
    return res.status(200).json(payload);
  });

  const server = registry.listen(REGISTRY_PORT, () => {
    console.log(`Registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}