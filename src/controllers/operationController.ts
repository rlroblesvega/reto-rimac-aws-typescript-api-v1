import OperationService from '../services/OperationService';
import { APIGatewayProxyResult, APIGatewayProxyEvent} from 'aws-lambda';

const operationSer = new OperationService();
import { sendBadRequestResponse, sendBadRequestBodyResponse, sendInternalServerErrorResponse, sendNotFoundErrorResponse, sendSuccessfulCreateResponse, sendSuccessfulResponse } from '../common/responders';
import { MESSAGE_CONSTANTS } from '../common/constants';
import { payloadSchema } from '../validations/validation';

export const saveCustomData_handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return sendBadRequestResponse(MESSAGE_CONSTANTS.INVALID_REQUEST_BODY_EMPTY);
  }
  
  const payload = JSON.parse(event.body);
  const { error } = payloadSchema.validate(payload);

  if (error) {
    return sendBadRequestBodyResponse({
      message: 'Validation Error',
      details: error.details,
    }
    );
  }
  
  try {
    const response = await operationSer.saveCustomData(payload);
    return sendSuccessfulCreateResponse({
      code: 0,
      message: 'Success'
    });
  } catch (error: any) {
    console.error(error);
    return sendInternalServerErrorResponse(MESSAGE_CONSTANTS.INTERNAL_SERVER_ERROR);
  }
};

export const getCustomData_handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const customData = await operationSer.getCustomData();
    return sendSuccessfulResponse({
      code: 0,
      message: 'Success',
      payload: customData
    });
  } catch (error: any) {
    console.error(error);
    return sendInternalServerErrorResponse(MESSAGE_CONSTANTS.INTERNAL_SERVER_ERROR);
  }
};

export const saveDataApisExternals_handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const peopleId = event.queryStringParameters?.peopleId;
    if (!peopleId) {
      return sendBadRequestResponse(MESSAGE_CONSTANTS.INVALID_REQUEST_QUERY_PEOPLE_ID);
    }
    const response = await operationSer.saveDataApisExternals(peopleId);
    return sendSuccessfulResponse({
      code: 0,
      message: 'Success',
      payload: response
    });

  } catch (error: any) {
    console.error(error);
    return sendInternalServerErrorResponse(MESSAGE_CONSTANTS.INTERNAL_SERVER_ERROR);
  }
};

export const getHistory_handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
  try {
    const page = event.queryStringParameters?.page || 1;
    const size = event.queryStringParameters?.size || 10;

    const response = await operationSer.paginateData(20);
    const paginatedItems = operationSer.paginate(response, Number(page), Number(size));
    return sendSuccessfulResponse({
      code: 0,
      message: 'Success',
      payload: paginatedItems
    });
  } catch (error: any) {
    console.error(error);
    return sendInternalServerErrorResponse(MESSAGE_CONSTANTS.INTERNAL_SERVER_ERROR);
  }
};