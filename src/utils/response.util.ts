export interface ApiResponses<T> {
  message?: string;
  result?: T;
  statusCode: number;
}

export function createResponse<T>(
  statusCode: number,
  result?: T,
  message?: string,
): ApiResponses<T> {
  return {
    message,
    result,
    statusCode,
  };
}
