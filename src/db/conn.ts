import dynamoDBClient from "./client";
import DynamoDBService from "./DynamoDBService"

const dynamoDBService = new DynamoDBService(dynamoDBClient());
export default dynamoDBService;