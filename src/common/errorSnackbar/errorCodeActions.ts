import * as types from './errorCodeActionTypes';

export const setErrorCode = (errorCode) => {
    return { type: types.SET_ERROR_CODE, errorCode };
};

export const resetErrorCode = () => {
    return { type: types.RESET_ERROR_CODE };
};

const errorCodeActions = { setErrorCode, resetErrorCode };
export default errorCodeActions;
