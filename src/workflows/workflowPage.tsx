import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { find, compact } from 'lodash';
import { Snackbar } from 'material-ui';

import Workflow, { IWorkflow } from './workflow';
import WorkflowContent from './workflowContent';
import * as workflowActions from './workflowActions';
import * as branchActions from '../branches/branchActions';
import * as appActions from '../home/appsActions';
import { routeActions, BranchInfo, Logs } from '../common';

interface IEditableWorkflowProps {
    branches: any[];
    branch: string;
    currentApp: any;
    workflows: IWorkflow[];
    editableWorkflow: IWorkflow;
    actions: any;
    routeActions: any;
    branchActions: any;
    appActions: any;
}

interface IEditableWorkflowState {
    showMessage: boolean;
    message: string;
}

class WorkflowPage extends React.Component<IEditableWorkflowProps, IEditableWorkflowState> {
    constructor(props, context) {
        super(props, context);

        this.getCurrentBranch = this.getCurrentBranch.bind(this);
        this.publishContent = this.publishContent.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.handleMessengerClose = this.handleMessengerClose.bind(this);
        this.executeWorkflow = this.executeWorkflow.bind(this);

        this.state = {
            showMessage: false,
            message: ''
        };
    }
    public componentWillMount() {
        const { currentApp } = this.props;
        if (!(currentApp && currentApp.id === 'workflow-manager')) {
            this.props.appActions.setCurrentApp('workflow-manager');
        }

        if (!this.props.branch) {
            // restore page behavior if window is reloaded
            const urlParams = compact(window.location.pathname.split('/'));
            const branchName = urlParams[2];
            const partner = urlParams[4];
            const feed = urlParams[6];
            this.props.branchActions.setCurrentBranch(branchName);
            this.props.branchActions.fetchBranches(this.props.currentApp || {id: 'workflow-manager'}).then(() => {
                this.props.actions.fetchWorkflows(branchName).then(() => {
                    const fileName = `configure_${partner}_${feed}.sql`.toLowerCase(); // config file names are always in lowercase
                    const workflow = find(this.props.workflows, { name: fileName });
                    if (workflow) {
                        this.props.actions.setEditableWorkflow(workflow);
                        this.props.actions.fetchContent(workflow, branchName);
                    }
                });
            }); 
        }

        if (this.props.editableWorkflow.path && !this.props.editableWorkflow.content) {
            this.props.actions.fetchContent(this.props.editableWorkflow, this.props.branch);
        }
    }
    private getCurrentBranch() {
        const { branches, branch } = this.props;

        return find(branches, { name: branch }) || { name: branch };
    }
    private shouldSendNewPullRequest(branch: any) {
        const pullRequestsPresent = branch.pullRequests && branch.pullRequests.length > 0;
        const pullRequestOpen = find(branch.pullRequests || [], { state: 'open' });
        return !pullRequestsPresent || !pullRequestOpen;
    }
    private publishContent() {
        const branch = this.getCurrentBranch();
        let successMessage = '';
        let updatePR: Promise<any>;
        if (this.shouldSendNewPullRequest(branch)) {
            updatePR = this.props.branchActions.createPullRequest(this.props.branches, this.props.branch);
            successMessage = 'Created Pull Request';
        } else {
            updatePR = this.props.branchActions.updatePullRequest(this.props.branches, this.props.branch);
            successMessage = 'Updated Pull Request';
        }

        updatePR.then(() => {
            const updatedBranch = this.getCurrentBranch();
            this.setState({ showMessage: true, message: successMessage });
        });
    }
    private updateContent(content: string) {
        this.props.actions.updateWorkflow(this.props.editableWorkflow, content, this.props.branch).then(() => {
            this.setState({ showMessage: true });
        }).catch((error) => {
            console.log('failed to update workflow ', error.message);
        });
    }
    private handleMessengerClose() {
        this.setState({ showMessage: false, message: '' });
    }
    private executeWorkflow(){
        console.log('execute workflow');
        this.props.actions.executeWorkflow(this.props.editableWorkflow);
    }
    public render(): JSX.Element {
        return <div>
            <BranchInfo
                currentBranch={this.getCurrentBranch()}
                dataPartner={this.props.editableWorkflow.dataPartner}
                feedType={this.props.editableWorkflow.feedType}
                name={this.props.editableWorkflow.name}
                enablePublishChanges={true}
                onPublish={this.publishContent}
                executable={true}
                onExecute={this.executeWorkflow}
            />

            {this.props.editableWorkflow.content && <WorkflowContent
                editable={true}
                content={this.props.editableWorkflow.content}
                onUpdate={this.updateContent}
            />}

            {this.props.editableWorkflow.processLogs && <Logs logs={this.props.editableWorkflow.processLogs}/>}

            <Snackbar
                open={this.state.showMessage}
                message={this.state.message || "Updated config successfully"}
                autoHideDuration={2000}
                onRequestClose={this.handleMessengerClose}
            />
        </div>;
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        branches: state.branches,
        branch: state.currentBranch,
        editableWorkflow: state.editableWorkflow,
        workflows: state.workflows,
        currentApp: state.currentApp
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        actions: bindActionCreators(workflowActions, dispatch),
        routeActions: bindActionCreators(routeActions, dispatch),
        branchActions: bindActionCreators(branchActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    });
};
export default connect(mapStateToProps, mapDispatchToProps)(WorkflowPage);


