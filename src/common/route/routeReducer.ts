import * as types from './routeActionTypes';
import initialState from '../../reducers/initialState';

const routeReducer = (state = initialState.currentRoute, action) => {
    switch (action.type) {
        case types.CHANGE_ROUTE:
            return action.currentRoute;

        default:
            return state;
    }
};

export default routeReducer;
