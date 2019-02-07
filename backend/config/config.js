import Joi from "joi";

// require and configure dotenv, will load vars in .env in PROCESS.ENV
import dotenv from "dotenv";

dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),
  SALT_ROUNDS: Joi.number().default(10),
  MONGO_PORT: Joi.number().default(27017),
  USE_DB: Joi.boolean().default(false),
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description("JWT Secret required to sign"),
  MONGO_URI: Joi.string()
    .required()
    .description("Mongo DB host url"),
  MONGO_HOST_TEST: Joi.string()
    .required()
    .description("Mongo DB test host url"),
  ORG_MSP: Joi.string()
    .required()
    .description('The name of the Membership Service Provider. Ex: "Org1MSP"'),
  CHANNEL_NAME: Joi.string()
    .required()
    .description('The name of the Channel. Ex: "mychannel"'),
  CHAINCODE_NAME: Joi.string()
    .required()
    .description('The name of the chaincode package. Ex: "my-chaincode"'),
  CA_DOMAIN: Joi.string()
    .required()
    .description(
      'The domain of the Certificate Authorithy. Ex: "ca.example.com"'
    ),
  PEER1: Joi.string()
    .required()
    .description(
      'The endpoint of any peer (Can be multiple.. PEER2, PEER3,..). Ex: "http://localhost:7050"'
    ),
  ORDERER1: Joi.string()
    .required()
    .description(
      'The endpoint of any orderer (Can be multiple.. ORDERER2, ORDERER3,..). Ex: "http://localhost:7051"'
    )
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(
    `Check your '.env' file (located at the root of this project),
    validation error: ${error.message}`
  );
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST_TEST,
    port: envVars.MONGO_PORT
  },
  mongo_test: envVars.MONGO_HOST_TEST,
  useDb: envVars.USE_DB,
  ORG_MSP: envVars.ORG_MSP,
  CHANNEL_NAME: envVars.CHANNEL_NAME,
  CHAINCODE_NAME: envVars.CHAINCODE_NAME,
  CA_DOMAIN: envVars.CA_DOMAIN,
  CA_URL: envVars.CA_URL,
  PEERS: [envVars.PEER1],
  ORDERERS: [envVars.ORDERER1],
  saltRounds: envVars.SALT_ROUNDS
};

export default config;
