import HomePage from './home/homePage';
import Home from 'material-ui/svg-icons/action/home';

import AddConfigPage from './addConfig/addConfigPage';
import CopyConfigPage from './copyConfig/copyConfig';
import EditConfigPage from './editableConfig/editableConfigContainer';
import EditConfig from 'material-ui/svg-icons/action/swap-horiz';
import ConfigsPage from './configs/configsPage';

import LogInPage from './user/login';
import LogInSuccessPage from './user/loginSuccess';

import WorkflowPage from './workflows/workflowPage';
import WorkflowsPage from './workflows/workflowsPage';
import AddWorkflowPage from './addWorkflow/addWorkflowPage';

const routes = {
    home: {
        path: '/',
        component: HomePage,
        title: 'Home',
        id: 'home',
        exact: true,
        icon: Home,
        sidebar: true
    },
    login: {
        path: '/login',
        component: LogInPage,
        title: '',
        id: 'login',
        exact: true,
        icon: null,
        sidebar: false
    },
    loginSuccess: {
        path: '/loginsuccess',
        component: LogInSuccessPage,
        title: '',
        id: 'loginSuccess',
        exact: true,
        icon: null,
        sidebar: false
    },
    configs: {
        path: '/configs',
        component: ConfigsPage,
        title: '',
        id: 'configs',
        icon: EditConfig,
        sidebar: true
    },
    editConfig: {
        path: '/config/branch/:branch/partner/:partner/feed/:feed',
        component: EditConfigPage,
        title: '',
        id: 'partnerConfig',
        icon: EditConfig,
        sidebar: true
    },
    copyConfig: {
        path: '/copy/branch/:branch/partner/:partner/feed/:feed',
        component: CopyConfigPage,
        title: '',
        id: 'copyConfig',
        icon: EditConfig,
        sidebar: true
    },
    addConfig: {
        path: '/branch/:branch/config/new',
        component: AddConfigPage,
        title: '',
        id: 'addConfig',
        icon: null,
        sidebar: true
    },
    workflows: {
        path: '/workflows',
        component: WorkflowsPage,
        title: '',
        id: 'workflows',
        icon: null,
        sidebar: false
    },
    workflow: {
        path: '/workflow/branch/:branch/partner/:partner/feed/:feed',
        component: WorkflowPage,
        title: '',
        id: 'workflow',
        icon: null,
        sidebar: false
    },
    addWorkflow: {
        path: '/branch/:branch/workflow/new',
        component: AddWorkflowPage,
        title: '',
        id: 'addWorkflow',
        icon: null,
        sidebar: true
    },
};

export default routes;
