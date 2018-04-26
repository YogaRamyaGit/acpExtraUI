import * as _ from 'lodash';

import {
    configApi,
    userApi,
    branchApi,
    feedConfigApi,
    sourceLayoutApi,
    dataPartnerApi,
    feedTypeApi,
    businessRuleApi,
    pullRequestApi,
    workflowApi
} from './api';

import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import * as connectSqlite from 'connect-sqlite3';
import * as fs from 'fs';

const jsonParser = bodyParser.json();

export default class App {
    private _app: any;
    constructor(app) {
        this._app = app;
    }

    public registerApiLogger() {
        const logDir = 'logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        this._app.use(expressWinston.logger({
            transports: [
                new (winston.transports.File)({ filename: 'logs/api.log' })
            ],
            meta: true, // optional: control whether you want to log the meta data about the request (default to true)
            msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
            expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
            colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
            ignoreRoute: (req, res) => false, // optional: allows to skip some log messages based on request and/or response
        }));
    }

    public registerErrorLogger() {
        const logDir = 'logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        this._app.use(expressWinston.errorLogger({
            transports: [
                new winston.transports.Console({
                    json: true,
                    colorize: true
                }),
                new (winston.transports.File)({ filename: 'logs/error.log' })
            ]
        }));
    }

    public registerAuthApis(secret: string) {
        const app = this._app;
        const SQLiteStore = connectSqlite(session);

        app.use(session({
            secret,
            store: new SQLiteStore(),
            resave: false,
            saveUninitialized: false
        }));

        // Gets Access token and user Info
        // Params: code: string - code provided by GitHub after login
        app.get('/auth/userInfo', userApi.getUserInfo);

        // Returns logged in user information
        app.get('/auth/user', userApi.getUser); // To-Do - swati - evaluate if can be removed

        // Logs user out
        app.post('/auth/logout', userApi.logout);

        // builds the login url and returns
        app.get('/auth/loginUrl', userApi.getLoginUrl);
    }

    public registerConfigApis() {
        const app = this._app;

        // Register middleware
        app.use((req, res, next) => {
            if (!_.includes(req.originalUrl, '/api')) {
                return next();
            }

            if (!(req.session.user && req.session.user.loggedIn)) {
                return res.status(401).send('Login Required');
            } else {
                next();
            }
        });

        // fetch all branches for the repo. Max limit 100
        app.get('/api/configBranches', branchApi.getConfigBranches);

        // fetch all branches for the repo. Max limit 100
        app.get('/api/workflowBranches', branchApi.getWorkflowBranches);

        // fetch all pull requests for the base branch
        app.get('/api/pullRequests', pullRequestApi.getPullRequests);

        // create a new branch off the base branch
        // payload: branch: string - name of the branch
        app.post('/api/branch', jsonParser, branchApi.createBranch);

        // create a new branch off the base branch
        // payload: branch: string - name of the branch
        app.post('/api/workflowBranch', jsonParser, branchApi.createWorkflowBranch);

        // Fetch all config files for a particular branch
        // Params: branch: string - name of the branch
        // Params: perPage: number - records per page
        // Params: page: number - number of current page
        app.get('/api/configs', configApi.getConfigs);

        // Fetch contents of a particular file
        // Params: filePath: string - path of the file to get contents
        // Params: branch: string - current branch
        app.get('/api/content', configApi.getContent);

        // Update contents of a file
        // Payload: contents: string - Content to be updated
        // Payload: sha: string - sha of the last updation of the file(Encoded in Base-64)
        // Payload: path: string - path of the file to be updated
        // Payload: branch: string - branch in which file will be updated
        app.post('/api/updateConfig', jsonParser, configApi.updateConfig);

        // Creates a new file
        // Payload: fileName: string - Name of the new file
        // Payload: contents: string - contents of the file(Encoded in Base-6
        // Payload: branch: string - branch in which file will be added
        app.post('/api/createConfig', jsonParser, configApi.createConfig);

        // Creates a new Pull Request
        // Payload: branch: string - branch from which PR will be created
        app.post('/api/publishConfig', jsonParser, pullRequestApi.createPullRequest);

        // Creates a new Pull Request
        // Payload: branch: string - branch from which PR will be created
        app.put('/api/publishConfig', jsonParser, pullRequestApi.updatePullRequest);

        // Fetch List of tables and target columns applicable for the feed
        // Params: branch: string - Name of the branc
        // Params: feedType: string - Feed type
        app.get('/api/targetColumns', feedConfigApi.getTargetColumns);

        // Fetch List of tables applicable for the feed
        // Params: branch: string - Name of the branch
        // Params: feedType: string - Feed type
        app.get('/api/targetTables', feedConfigApi.getTargetTables);

        // Fetch list of all tables to pick tables from
        app.get('/api/tables', feedConfigApi.getAllTables);

        // Update contents of source layout for a config file
        // creates/updates a file in the sourceLayout folder with same file name
        // Payload: contents: string - Content to be updated
        // Payload: sha: string - sha of the last updation of the file(Encoded in Base-64)
        // Payload: name: string - name  of the file to be updated
        // Payload: branch: string - branch in which file will be updated
        app.post('/api/updateSourceLayout', jsonParser, sourceLayoutApi.updateSourceLayout);

        // Fetch contents of source layout for a file
        // Params: name: string - name of the config file
        // Params: branch: string - current branch
        app.get('/api/sourceLayout', sourceLayoutApi.getSourceLayout);

        // Fetch all data partner names
        app.get('/api/dataPartners', dataPartnerApi.getDataPartners);

        // Fetch all feed types
        app.get('/api/feedTypes', feedTypeApi.getFeedTypes);

        // Fetch all business rules
        app.get('/api/businessRules', businessRuleApi.getBusinessRules);

        // copy file to EMR cluster
        // Payload: contents: string - Content to be updated(Base 64 encoded)
        // Payload: name: string - name of the file
        app.post('/api/copyToCluster', jsonParser, configApi.copyToCluster);

        // execute file in EMR cluster
        // Payload: name: string - name of the file
        app.post('/api/runInCluster', jsonParser, configApi.executeConfig);
    }

    public registerWorkflowApis() {
        const app = this._app;
        // Fetch all workflows
        // Params: branch: string - name of the branch
        app.get('/api/workflows', workflowApi.getWorkflows);

        // Fetch workflow for the particular partner and feed
        // Params: branch: string - name of the branch
        // Params: path: string - path of the file
        app.get('/api/workflow', workflowApi.getWorkflow);

        // create workflow for the particular partner and feed
        // Params: branch: string - name of the branch
        // Params: path: string - path of the file
        // Params: name: string - name of the file
        app.post('/api/workflow', jsonParser, workflowApi.createWorkflow);

        // create workflow for the particular partner and feed
        // Params: branch: string - name of the branch
        // Params: path: string - path of the file
        // Params: name: string - name of the file
        app.put('/api/workflow', jsonParser, workflowApi.updateWorkflow);

        // create workflow for the particular partner and feed
        // Params: partner: string - name of the partner
        // Params: feed: string - name of the feed
        app.get('/api/getWorkFlowTemplate', workflowApi.getWorkFlowTemplate);

        // get content of a config by config name
        // Params: name: string - name of the file
        // Params: branch: string - name of the branch
        app.get('/api/configTables', configApi.getConfigTables);

        // run the workflow on remote DB
        // payload: script: string - workflow content
        app.post('/api/runWorkflowOnDB', jsonParser, workflowApi.putWorkFlowConfigurationsToDB);

        // execute workflow in EMR cluster
        // Payload: dataPartner: string - data partner name
        // Payload: feedType: string - feed type
        app.post('/api/executeWorkflow', jsonParser, workflowApi.executeWorkflow);
    }
}
