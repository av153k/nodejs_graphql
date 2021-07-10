import { config } from "./config/config";

console.log(
  `Current environment is ${config!.PORT} running on port ${config!.NODE_ENV}`
);
