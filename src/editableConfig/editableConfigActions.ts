import axios from 'axios';
import * as _ from 'lodash';
import helper from '../helper';
import * as types from './editableConfigActionTypes';
import { IConfig } from '../configs/config';

import { loaderActions, errorCodeActions } from '../common';

export const setEditableConfig = (config: IConfig) => {
    return { type: types.SET_EDITABLE_CONFIG, config };
};

export const setConfig = (config) => {
    return { type: types.UPDATE_CONFIG, config };
};

export const publishConfig = (config: IConfig, branch: string) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .post('/api/publishConfig', { branch })
            .then((response) => {
                config.publishUrl = response.data.url;
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
                throw (new Error('Failed to publish')); // To avoid the second message
            });
    };
};

export const updateConfig = (config: IConfig, branch: string) => {
    const contents = window.btoa(JSON.stringify(config.content, null, 4));
    const { path, sha } = config;

    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .post('/api/updateConfig', { path, contents, sha, branch })
            .then((response) => {
                config.sha = response.data.sha;
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
                throw (new Error('Failed to update')); // To avoid the second message
            });
    };
};

export const fetchContent = (config: IConfig, branch: string) => {
    const filePath = config.path;
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/content', { params: { filePath, branch } })
            .then((response) => {
                const content = window.atob(response.data.content);
                dispatch(setConfig(_.assign({}, response.data, { content: helper.parseJson(content) })));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const fetchTargetColumns = (config: IConfig, branch: string) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/targetColumns', { params: { feedType: config.feedType, branch, targetTables: config.targetTables } })
            .then((response) => {
                config.targetColumns = response.data;
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const fetchTargetTables = (config: IConfig, branch: string) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/targetTables', { params: { feedType: config.feedType, branch } })
            .then((response) => {
                config.allTargetTables = response.data.targetTables;
                if (config.targetTables.length <= 0) {
                    config.targetTables = response.data.targetTables;
                }
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const updateSourceLayout = (config: IConfig, branch: string) => {
    const { name, sha, content } = config.sourceLayout;
    let contents = '';
    try {
        contents = window.btoa(JSON.stringify(content, null, 4));
    } catch (e) {
        throw new Error('invalid source layout');
    }

    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .post('/api/updateSourceLayout', { name, contents, sha, branch })
            .then((response) => {
                // update source layout
                const fileName = response.data.name;
                const newSha = response.data.sha;
                const newSourceLayout = { name: fileName, sha: newSha, content };
                config.sourceLayout = newSourceLayout;
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
                throw (new Error('Failed to update')); // To avoid the second message
            });
    };
};

export const fetchSourceLayout = (config: IConfig, branch: string) => {
    const { name } = config.sourceLayout;
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/sourceLayout', { params: { name, branch } })
            .then((response) => {
                const content = window.atob(response.data.content);
                const { sha } = response.data;
                const fileName = response.data.name;
                config.sourceLayout = { name: fileName, sha: sha, content: helper.parseJson(content) };
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                if (error.request.status === 404) {
                    // source layout not present for the file
                    config.sourceLayout = { name: '', sha: '', content: [] };
                    dispatch(setConfig(config));
                } else {
                    dispatch(errorCodeActions.setErrorCode(error.request.status));
                }
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const copyToCluster = (config: IConfig, branch: string) => {
    const contents = window.btoa(JSON.stringify(config.content, null, 4));
    const { name } = config;

    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .post('/api/copyToCluster', { contents, name})
            .then((response) => {
                config.readyToDeploy = true;
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
                throw (new Error('Failed to update')); // To avoid the second message
            });
    };
};

export const runInCluster = (config: IConfig) => {
    const { name } = config;

    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .post('/api/runInCluster', { name})
            .then((response) => {
                config.processLogs = response.data;
                dispatch(setConfig(config));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                config.processLogs = {};
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
                throw (new Error('Failed to update')); // To avoid the second message
            });
    };
}

