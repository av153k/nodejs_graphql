import dotenv from "dotenv";
const dotEnvOutputs = dotenv.config();

if (dotEnvOutputs.error) {
    throw dotEnvOutputs.error;
}


const { parsed: config } = dotEnvOutputs;

export { config };
