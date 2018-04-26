import * as types from './branchActionTypes';
import axios from 'axios';
import { findIndex, uniqBy, filter } from 'lodash';

import helper from '../helper';
import { loaderActions, errorCodeActions } from '../common';

export const setCurrentBranch = (branch: string) => {
    return { type: types.SET_CURRENT_BRANCH, branch };
};

export const createPullRequest = (branches, branchName) => {
    const branchIndex = findIndex(branches, { name: branchName });

    if (branchIndex < 0) {
        throw (new Error('no such branch'));
    }

    const branch = branches[branchIndex];

    const { name } = branch;
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .post('/api/publishConfig', { branch: name })
            .then((response) => {
                const pr = response.data;
                branches[branchIndex].pullRequests = branches[branchIndex].pullRequests || [];
                branches[branchIndex].pullRequests.push(pr);
                dispatch(fetchBranchesSuccess(branches));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const updatePullRequest = (branches, branchName) => {
    const branchIndex = findIndex(branches, { name: branchName });

    if (branchIndex < 0) {
        throw (new Error('no such branch'));
    }

    const branch = branches[branchIndex];
    // find open pull request
    const pullRequest = branch.pullRequests.find(p => p.state === 'open');

    const { name, prId, prState } = branch;
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios
            .put('/api/publishConfig', { branch: branchName, prId: pullRequest.number, prState: pullRequest.state })
            .then((response) => {
                const pr = response.data;
                const prIndex = findIndex(branch.pullRequests, { id: pr.id });

                branches[branchIndex].pullRequests = branches[branchIndex].pullRequests || [];
                (pr.index >= 0) ? branches[branchIndex].pullRequests[prIndex] = pr : branches[branchIndex].pullRequests.push(pr);
                dispatch(fetchBranchesSuccess(branches));
                dispatch(loaderActions.stopLoader());
            })
            .catch(error => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

const fetchBranchesSuccess = (branches) => {
    return { type: types.FETCH_BRANCHES_SUCCESS, branches };
};

export const fetchBranches = (currentApp: any = {}) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        let branches: any[] = [];
        const api = currentApp.id === 'workflow-manager' ? '/api/workflowBranches' : '/api/configbranches';
        return axios.get(api)
            .then((response) => {
                branches = response.data;
                return axios.get('/api/pullRequests?state=all');
            }).then((response) => {
                const pullRequests = response.data;
                branches.forEach(branch => {
                    const pullRequestForBranch = filter(pullRequests, (pr) => pr.head.ref === branch.name);
                    branch.pullRequests = pullRequestForBranch;
                });
                dispatch(fetchBranchesSuccess(branches));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

const createBranchSuccess = (branch) => {
    return { type: types.CREATE_BRANCH_SUCCESS, branch };
};

const constructBranch = (branchName: string, branchInfo: any) => {
    return {
        name: branchName,
        commit: {
            url: branchInfo.url,
            sha: branchInfo.object.sha
        }
    };
};

export const createBranch = (branch) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.post('/api/branch', { branch })
            .then((response) => {
                const newBranch = constructBranch(branch, response.data);
                dispatch(createBranchSuccess(newBranch));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};

export const createWorkflowBranch = (branch) => {
    return (dispatch) => {
        dispatch(loaderActions.startLoader());
        return axios.post('/api/workflowBranch', { branch })
            .then((response) => {
                const newBranch = constructBranch(branch, response.data);
                dispatch(createBranchSuccess(newBranch));
                dispatch(loaderActions.stopLoader());
            }).catch((error) => {
                dispatch(errorCodeActions.setErrorCode(error.request.status));
                dispatch(loaderActions.stopLoader());
            });
    };
};
