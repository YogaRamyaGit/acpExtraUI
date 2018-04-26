import * as types from './dataPartnerActionTypes';
import initialState from '../reducers/initialState';

const dataPartnersReducer = (state = initialState.dataPartners, action) => {
    switch (action.type) {
        case types.FETCH_DATA_PARTNERS_SUCCESS:
            return action.dataPartners;

        default:
            return state;
    }
};

export default dataPartnersReducer;
