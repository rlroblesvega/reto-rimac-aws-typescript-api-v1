import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = (): DynamoDBDocumentClient => {
  if (process.env.IS_OFFLINE) {
    console.log("Using local DynamoDB");
    const client = new DynamoDBClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
    const dynamo = DynamoDBDocumentClient.from(client);
    return dynamo
  }

  console.log("Using Cloud DynamoDB");
  const client = new DynamoDBClient({});
  const dynamo = DynamoDBDocumentClient.from(client);
  return  dynamo;
};

export default dynamoDBClient
