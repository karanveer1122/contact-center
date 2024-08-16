const errors = [
    { code: 1000, httpStatus: 500, message: 'Internal error. Contact admin for support.' },
    { code: 1001, httpStatus: 500, message: 'Unable to process request. Contact admin for support.' },
    { code: 1002, httpStatus: 400, message: 'Schema validation error.' },
    { code: 1003, httpStatus: 400, message: 'Unknown error.' },
];

function getError (code) {
    return errors.find(e => e.code === code);
}

function handleError (code, correlationId, msg=null) {
    const error = getError(code);

    let errorMsg = msg ? msg : error.message;

    const errorResp = errorResponse(error.httpStatus, error.code, errorMsg, correlationId);

    return errorResp;
}

function errorResponse(httpStatus, errCode, message, correlationId) {
    return JSON.stringify({
        httpStatus: httpStatus,
        code: errCode,
        message: message,
        correlationId: correlationId
    });
  }

module.exports = { getError, handleError };
