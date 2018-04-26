import * as _ from 'lodash';

import * as types from './userActionTypes';
import initialState from '../reducers/initialState';

const userReducer = (state = initialState.loggedInUser, action) => {
    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return _.assign(action.user, state);
        case types.LOGIN_FAILURE:
            return {};
        case types.UPDATE_USER:
            return action.user;

        default:
            return state;
    }
};

export default userReducer;
