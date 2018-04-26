import { combineReducers } from 'redux';
import configs from '../configs/configsReducer';
import branches from '../branches/branchesReducer';
import currentBranch from '../branches/currentBranchReducer';
import loaderCount from '../common/loader/loaderReducer';
import errorCode from '../common/errorSnackbar/errorCodeReducer';
import loggedInUser from '../user/userReducer';
import currentRoute from '../common/route/routeReducer';
import editableConfig from '../editableConfig/editableConfigReducer';
import dataPartners from '../dataPartners/dataPartnersReducer';
import feedTypes from '../feedTypes/feedTypesReducer';
import allTables from '../allTables/allTablesReducer';
import businessRules from '../businessRules/businessRulesReducer';
import currentApp from '../home/appsReducer';
import workflows from '../workflows/workflowsReducer';
import editableWorkflow from '../workflows/editableWorkflowReducer';

const rootReducer = combineReducers({
    currentRoute,
    currentApp,
    loggedInUser,
    configs,
    editableConfig,
    branches,
    currentBranch,
    loaderCount,
    errorCode,
    dataPartners,
    feedTypes,
    allTables,
    businessRules,
    workflows,
    editableWorkflow
});

export default rootReducer;
