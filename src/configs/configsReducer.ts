import * as types from './configActionTypes';
import initialState from '../reducers/initialState';

const ConfigsReducer = (state = initialState.configs, action) => {
    switch (action.type) {
        case types.FETCH_CONFIGS_SUCCESS:
            return action.configs;

        case types.ADD_CONFIG_SUCCESS:
            return [action.config, ...state];

        default:
            return state;
    }
};

export default ConfigsReducer;
