import * as _ from 'lodash';
import * as types from './userActionTypes';
import axios from 'axios';

import { loaderActions, errorCodeActions } from '../common';

const loginSuccess = (user) => {
    return { type: types.LOGIN_SUCCESS, user };
};

const loginError = () => {
    return { type: types.LOGIN_FAILURE };
};

export const getUserInfo = (code: string, state: string) => {
    const params = { code, state };
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get(`/auth/userInfo`, { params })
            .then((response) => {
                dispatch(loginSuccess(response.data));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

const updateUser = (user) => {
    return { type: types.UPDATE_USER, user };
};

export const logout = () => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.post(`/auth/logout`)
            .then((response) => {
                dispatch(updateUser(response.data));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.startLoader());
            });
    };
};

export const login = () => {
    // redirect to github
    return axios.get(`/auth/loginUrl`)
        .then((response) => {
            const loginUrl = response.data.loginUrl || '';
            window.location.href = loginUrl;
        }).catch((error) => {
            console.log('Failed to redirect', error);
        });
};

export const fetchUser = () => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get(`/auth/user`)
            .then((response) => {
                dispatch(updateUser(response.data));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

