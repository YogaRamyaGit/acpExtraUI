import * as types from './businessRuleActionTypes';
import axios from 'axios';

import { map } from 'lodash';

import { loaderActions, errorCodeActions } from '../common';

const fetchBusinessRulesSuccess = (businessRules: any[]) => {
    return { type: types.FETCH_BUSINESS_RULES_SUCCESS, businessRules };
};

export const fetchBusinessRules = () => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/businessRules')
            .then((response) => {
                console.log('response', response);
                let content = window.atob(response.data.content);
                // remove trailing commas, JSON.parse fails to parse
                // reference - https://stackoverflow.com/questions/34344328/json-remove-trailiing-comma-from-last-object
                const regex = /\,(?=\s*?[\}\]])/g;
                content = content.replace(regex, ''); // remove all trailing commas
                const businessRules = (JSON.parse(content) || {})['business_rules'];
                dispatch(fetchBusinessRulesSuccess(businessRules || {}));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};
