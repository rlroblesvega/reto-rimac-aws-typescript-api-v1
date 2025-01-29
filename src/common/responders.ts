export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const sendSuccessfulMessageResponse = (
  message: string
) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendSuccessfulResponse = (
  response: Record<string, unknown>
) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export const sendSuccessfulCreateResponse = (
  response: Record<string, unknown>
) => {
  return {
    statusCode: 201,
    body: JSON.stringify(response),
  };
};

export const sendInternalServerErrorResponse = (
  message: string
) => {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendForbiddenErrorResponse = (
  message: string
) => {
  return {
    statusCode: 403,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendNotFoundErrorResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 404,
    body: JSON.stringify(response)
  }
}

export const sendBadRequestResponse = (
  message: string
) => {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendBadRequestBodyResponse = (
  response: Record<string, unknown>
) => {
  return {
    statusCode: 400,
    body: JSON.stringify(response),
  };
};
