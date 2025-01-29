import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  QueryCommand,
  paginateQuery,
  paginateScan
} from "@aws-sdk/lib-dynamodb";

export default class DynamoDBService {

  constructor(
    private docClient: DynamoDBDocumentClient
  ) { }

  async scanItem(input: any): Promise<any> {
    const params: ScanCommand = new ScanCommand(input);
    const result = await this.docClient.send(params);
    return result.Items;
  }

  async putItem(input: any): Promise<any> {
    const command = new PutCommand(input);
    await this.docClient.send(command);
  }

  async getItem(input: any): Promise<any> {
    const params: GetCommand = new GetCommand(input);
    const response = await this.docClient.send(params);
    return response.Item;
  }

  async queryItem(input: any): Promise<any> {
    const params: QueryCommand = new QueryCommand(input);
    const response = await this.docClient.send(params);
    return response.Items;
  }

  async query(input: any): Promise<any> {
    const params: QueryCommand = new QueryCommand(input);
    const response = await this.docClient.send(params);
    return response.Items;
  }

  async paginateQuery(input: any): Promise<any> {
    const items = [];
    const paginator = paginateScan(
      { client: this.docClient },
      input
    );
    
    for await (const page of paginator) {
      items.push(...page.Items);
    }
    return items;
  }

}
