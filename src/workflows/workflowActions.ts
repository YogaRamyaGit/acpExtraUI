import axios from 'axios';
import * as _ from 'lodash';
import helper from '../helper';
import Workflow, { IWorkflow } from './workflow';
import Config from '../configs/config';
import * as actionTypes from './workflowActionTypes';
import { loaderActions, errorCodeActions } from '../common';

export const setEditableWorkflow = (workflow) => {
    return { type: actionTypes.SET_EDITABLE_WORKFLOW, workflow };
};

const fetchWorkflowsSuccess = (workflows) => {
    return { type: actionTypes.FETCH_WORKFLOWS_SUCCESS, workflows };
};

export const fetchWorkflows = (sha, perPage = 1000, page = 1) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/workflows', { params: { sha, perPage, page } })
            .then((response) => {
                const workflows = _.map(response.data, (workflow: IWorkflow) => new Workflow(workflow));
                dispatch(fetchWorkflowsSuccess(workflows));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

const createWorkflowSuccess = (workflow) => {
    return { type: actionTypes.CREATE_WORKFLOW_SUCCESS, workflow };
};

export const createWorkflow = (branch, fileName, partner, feed) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        const configFileName = `${[partner.toLowerCase(), feed.toLowerCase()].join('_')}.cfg`;
        return axios.get('/api/configTables', { params: { name: configFileName, branch } }).then((response) => {
            // parse content and create config
            const content = window.atob(response.data.content);
            const config = new Config(_.assign({}, response.data, { content: helper.parseJson(content) }));
            return axios.get(`/api/getWorkFlowTemplate`, { params: { partner, feed, targetTables: config.targetTables } });
        }).then((response) => {
            const { workflow_template } = response.data;
            const content = Buffer.from(workflow_template).toString('base64');
            const path = `${partner}/${feed}/${fileName}`;
            return axios.post('/api/workflow', { content, path, branch });
        }).then((response) => {
            const { sha, name, path } = response.data.content;
            // add workflow to the list
            const newWorkflow = new Workflow({
                dataPartner: partner,
                feedType: feed,
                sha,
                name,
                path
            });
            dispatch(createWorkflowSuccess(newWorkflow));
            dispatch(setEditableWorkflow(newWorkflow));
            dispatch(loaderActions.stopLoader());
        }).catch((error) => {
            dispatch(errorCodeActions.setErrorCode(error.request.status));
            dispatch(loaderActions.stopLoader());
        });
    };
};

export const updateWorkflow = (workflow, content, branch) => {
    const contents = window.btoa(content);
    const { path, sha } = workflow;

    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .put('/api/workflow', { path, contents, sha, branch })
            .then((response) => {
                workflow.sha = response.data.sha;
                workflow.content = content;
                dispatch(setEditableWorkflow(workflow));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
                throw (new Error('Failed to update')); // To avoid the second message
            });
    };
};

export const fetchContent = (workflow: IWorkflow, branch: string) => {
    const { sha, path } = workflow;
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.get('/api/workflow', { params: { branch, path } })
            .then((response) => {
                console.log(response);
                const content = window.atob(response.data.content);
                dispatch(setEditableWorkflow(_.assign({}, response.data, { content, dataPartner: workflow.dataPartner, feedType: workflow.feedType })));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const executeWorkflow = (workflow: IWorkflow) => {
    const {dataPartner, feedType, content} = workflow;

    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.post('/api/runWorkflowOnDB', {script: content}).then((result) => {
            return axios.post('/api/executeWorkflow', { dataPartner, feedType })
        }).then((response) => {
            console.log(response);
            workflow.processLogs = response.data;
            dispatch(setEditableWorkflow(workflow));
            dispatch(loaderActions.stopLoader());
        }).catch((error) => {
            dispatch(errorCodeActions.setErrorCode(error.request.status));
            dispatch(loaderActions.stopLoader());
        });
    };
}
