import * as types from './loaderActionTypes';
import initialState from '../../reducers/initialState';

const loaderReducer = (state = initialState.loaderCount, action) => {
    switch (action.type) {
        case types.START_LOADER:
            return ++state;

        case types.STOP_LOADER:
            return --state;

        default:
            return state;
    }
};

export default loaderReducer;
