import * as types from './feedTypeActionTypes';
import axios from 'axios';

import * as _ from 'lodash';

import { loaderActions, errorCodeActions } from '../common';
import { defaultFeedTypes } from '../constants';

const fetchFeedTypesSuccess = (feedTypes: string[]) => {
    return { type: types.FETCH_FEED_TYPES_SUCCESS, feedTypes };
};

export const fetchFeedTypes = () => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/feedTypes')
            .then((response) => {
                let { feedTypes } = response.data;
                feedTypes = _.map(feedTypes, (feed) => feed[0]);
                feedTypes = defaultFeedTypes; // _.union(defaultFeedTypes, feedTypes);
                dispatch(fetchFeedTypesSuccess(feedTypes));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};
