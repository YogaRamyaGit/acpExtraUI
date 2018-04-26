import axios from 'axios';
import * as _ from 'lodash';
import Config, { IConfig } from './config';
import * as actionTypes from './configActionTypes';

import { loaderActions, errorCodeActions } from '../common';
import * as editableConfigActions from '../editableConfig/editableConfigActions';

const fetchConfigSuccess = (configs) => {
    return { type: actionTypes.FETCH_CONFIGS_SUCCESS, configs };
};

export const fetchConfigs = (branch, perPage = 1000, page = 1) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/configs', { params: { branch, perPage, page } })
            .then((response) => {
                const configs = _.map(response.data, (config: IConfig) => new Config(config));
                dispatch(fetchConfigSuccess(configs));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const addConfig = (config: IConfig) => {
    return { type: actionTypes.ADD_CONFIG_SUCCESS, config };
};

export const createConfig = (config: IConfig, branch) => {
    const content = window.btoa(JSON.stringify(config.content, null, 4));
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .post('/api/createConfig', { fileName: config.name, content, branch })
            .then((response) => {
                const newConfig = new Config(response.data);
                dispatch(addConfig(newConfig));
                dispatch(editableConfigActions.setEditableConfig(newConfig));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(loaderActions.stopLoader());
            });
    };
};
