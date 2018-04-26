import * as types from './businessRuleActionTypes';
import initialState from '../reducers/initialState';

const businessRulesReducer = (state = initialState.businessRules, action) => {
    switch (action.type) {
        case types.FETCH_BUSINESS_RULES_SUCCESS:
            return action.businessRules;

        default:
            return state;
    }
};

export default businessRulesReducer;
