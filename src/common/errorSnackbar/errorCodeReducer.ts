import * as types from './errorCodeActionTypes';
import initialState from '../../reducers/initialState';

const errorCodeReducer = (state = initialState.loaderCount, action) => {
    switch (action.type) {
        case types.SET_ERROR_CODE:
            return action.errorCode;

        case types.RESET_ERROR_CODE:
            return null;

        default:
            return state;
    }
};

export default errorCodeReducer;
