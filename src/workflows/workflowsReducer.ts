import * as types from './workflowActionTypes';
import initialState from '../reducers/initialState';

const workflowsReducer = (state = initialState.workflows, action) => {
    switch (action.type) {
        case types.FETCH_WORKFLOWS_SUCCESS:
            return action.workflows;

        case types.CREATE_WORKFLOW_SUCCESS:
            return [...state, action.workflow];

        default:
            return state;
    }
};

export default workflowsReducer;
