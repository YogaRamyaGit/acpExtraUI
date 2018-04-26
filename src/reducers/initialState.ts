import routes from '../routes';
import * as _ from 'lodash';

import Config, { IConfig } from '../configs/config';
import Workflow from '../workflows/workflow';

const startupPath = window.location.pathname;
const initialRoute = _.find(_.values(routes), { path: startupPath }) || {};

export default {
    currentRoute: initialRoute,
    currentApp: {},
    loggedInUser: {},
    configs: [],
    loaderCount: 0,
    branches: [],
    currentBranch: '',
    editableConfig: new Config({}),
    errorCode: null,
    dataPartners: [],
    feedTypes: [],
    allTables: [],
    businessRules: [],
    workflows: [],
    editableWorkflow: new Workflow({})
};
