import * as types from './feedTypeActionTypes';
import initialState from '../reducers/initialState';

const feedTypesReducer = (state = initialState.feedTypes, action) => {
    switch (action.type) {
        case types.FETCH_FEED_TYPES_SUCCESS:
            return action.feedTypes;

        default:
            return state;
    }
};

export default feedTypesReducer;
