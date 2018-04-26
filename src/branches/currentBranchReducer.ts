import * as types from './branchActionTypes';
import initialState from '../reducers/initialState';

const currentBranchReducer = (state = initialState.currentBranch, action) => {
    switch (action.type) {
        case types.SET_CURRENT_BRANCH:
            return action.branch;

        default:
            return state;
    }
};

export default currentBranchReducer;
