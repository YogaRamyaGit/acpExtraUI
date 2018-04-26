import * as types from './workflowActionTypes';
import initialState from '../reducers/initialState';
import Workflow from './workflow';

const editableWorkflowReducer = (state = initialState.editableWorkflow, action) => {
    switch (action.type) {
        case types.SET_EDITABLE_WORKFLOW:
            return new Workflow(action.workflow);

        default:
            return state;
    }
};

export default editableWorkflowReducer;
