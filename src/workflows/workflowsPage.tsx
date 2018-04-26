import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as workflowActions from './workflowActions';
import * as appActions from '../home/appsActions';
import { routeActions, SyncConfigs } from '../common';
import BranchSelector from '../branches/branchSelector';
import AddConfig from '../addConfig/addConfig';
import Workflow, { IWorkflow } from './workflow';
import WorkflowsTable from './workflowsTable';
import style from './workflowStyle';

interface IWorkflowsProps {
    branch: string;
    branches: any[];
    workflows: IWorkflow[];
    currentApp: any;
    actions: any;
    routeActions: any;
    appActions: any;
}

class WorkflowsPage extends React.Component<IWorkflowsProps, null> {
    constructor(props, context) {
        super(props, context);

        this.getBranchInfo = this.getBranchInfo.bind(this);
        this.editWorkflow = this.editWorkflow.bind(this);
    }
    public componentWillMount() {
        const { currentApp } = this.props;
        if (!(currentApp && currentApp.id === 'workflow-manager')) {
            this.props.appActions.setCurrentApp('workflow-manager');
        }

        if (this.props.branches.length && this.props.branch && this.props.workflows.length <= 0){
            const branchInfo = this.getBranchInfo(this.props.branches, this.props.branch);
            if (branchInfo && branchInfo.commit.sha) {
                this.props.actions.fetchWorkflows(branchInfo.commit.sha);
            }
        }
    }
    private getBranchInfo(branches: any[], branchName: string) {
        return branches.find(branch => branch.name === branchName);
    }
    public componentWillReceiveProps(nextProps) {
        const newbranchSelected = nextProps.branch !== this.props.branch;
        if (newbranchSelected) {
            const branchInfo = this.getBranchInfo(nextProps.branches, nextProps.branch);
            if (branchInfo && branchInfo.commit.sha) {
                this.props.actions.fetchWorkflows(branchInfo.commit.sha);
            }
        }
    }
    private editWorkflow(workflow) {
        this.props.actions.setEditableWorkflow(workflow);
        this.props.routeActions.setRoute('workflow', { branch: this.props.branch, partner: workflow.dataPartner, feed: workflow.feedType })
    }
    public render(): JSX.Element {
        return <div style={style.pageContainer}>
            <div style={style.topBarContainer}>
                <div>
                    <AddConfig />
                </div>

                <div>
                    <BranchSelector />
                    <SyncConfigs />
                </div>
            </div>
            {this.props.workflows.length > 0 && <div style={style.tableContainer}>
                <WorkflowsTable workflows={this.props.workflows} onEdit={this.editWorkflow} />
            </div>}
        </div>;
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        branch: state.currentBranch,
        branches: state.branches,
        workflows: state.workflows,
        currentApp: state.currentApp
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        actions: bindActionCreators(workflowActions, dispatch),
        routeActions: bindActionCreators(routeActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    });
};
export default connect(mapStateToProps, mapDispatchToProps)(WorkflowsPage);

