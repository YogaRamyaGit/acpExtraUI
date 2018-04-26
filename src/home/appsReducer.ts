import * as types from './appsActionTypes';
import initialState from '../reducers/initialState';

const appsReducer = (state = initialState.currentApp, action) => {
    switch (action.type) {
        case types.SET_CURRENT_APP:
            return action.app;

        default:
            return state;
    }
};

export default appsReducer;
