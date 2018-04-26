import * as types from './dataPartnerActionTypes';
import axios from 'axios';

import * as _ from 'lodash';

import { loaderActions, errorCodeActions } from '../common';

const fetchDataPartnersSuccess = (dataPartners: string[]) => {
    return { type: types.FETCH_DATA_PARTNERS_SUCCESS, dataPartners };
};

export const fetchDataPartners = () => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/dataPartners')
            .then((response) => {
                let { dataPartners } = response.data;
                dataPartners = _.map(dataPartners, (partner) => partner[0]);
                dispatch(fetchDataPartnersSuccess(dataPartners));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};
