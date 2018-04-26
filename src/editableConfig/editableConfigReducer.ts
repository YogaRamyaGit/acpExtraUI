import * as _ from 'lodash';

import Config from '../configs/config';
import * as types from './editableConfigActionTypes';
import initialState from '../reducers/initialState';

const EditableConfigReducer = (state = initialState.editableConfig, action) => {
    switch (action.type) {
        case types.SET_EDITABLE_CONFIG:
            return action.config;

        case types.UPDATE_CONFIG:
            return new Config(action.config);

        default:
            return state;
    }
};

export default EditableConfigReducer;
