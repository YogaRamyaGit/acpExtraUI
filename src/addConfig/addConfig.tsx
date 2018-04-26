import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RaisedButton } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';

import { routeActions } from '../common';
import * as branchActions from '../branches/branchActions';
import * as configActions from '../configs/configActions';
import * as workflowActions from '../workflows/workflowActions';
import AddBranchPopup from '../branches/addBranchPopup';

const style: React.CSSProperties = {
    height: 36,
    position: 'relative',
    top: 28
};

interface IBranch {
    name: string;
    commit: any;
}

interface IAddConfigProps {
    routeActions: any;
    branchActions: any;
    configActions: any;
    workflowActions: any;
    branches: IBranch[];
    currentApp: any;
}

interface IAddConfigState {
    showPopup: boolean;
}

class AddConfig extends React.Component<IAddConfigProps, IAddConfigState> {
    constructor(props, context) {
        super(props, context);

        this.onClick = this.onClick.bind(this);
        this.addNewBranch = this.addNewBranch.bind(this);
        this.cancelAddNew = this.cancelAddNew.bind(this);
        this.selectBranch = this.selectBranch.bind(this);
        this.createBranch = this.createBranch.bind(this);
        this.fetchRecords = this.fetchRecords.bind(this);
        this.state = { showPopup: false };
    }
    private onClick() {
        this.setState({ showPopup: true });
    }
    private fetchRecords(branch: string) {
        const { currentApp } = this.props;

        switch (currentApp.id) {
            case 'configs-manager':
                this.props.configActions.fetchConfigs(branch);
                this.props.routeActions.setRoute('addConfig', { branch });
                break;
            case 'workflow-manager':
                this.props.workflowActions.fetchWorkflows(branch);
                this.props.routeActions.setRoute('addWorkflow', { branch });
                break;
            default:
                this.props.configActions.fetchConfigs(branch);
                this.props.routeActions.setRoute('addConfig', { branch });
        }
    }
    private createBranch(branch: string) {
        const { currentApp } = this.props;

        switch (currentApp.id) {
            case 'configs-manager':
                return this.props.branchActions.createBranch(branch);
            case 'workflow-manager':
                return this.props.branchActions.createWorkflowBranch(branch);
            default:
                return this.props.branchActions.createBranch(branch);
        }
    }
    public addNewBranch(branch) {
        this.setState({ showPopup: false });
        this.createBranch(branch).then(() => {
            this.props.branchActions.setCurrentBranch(branch);
            this.fetchRecords(branch);
        });

    }
    public cancelAddNew() {
        this.setState({ showPopup: false });
    }
    public selectBranch(branch) {
        this.setState({ showPopup: false });
        this.props.branchActions.setCurrentBranch(branch);
        this.fetchRecords(branch);
    }
    public render(): JSX.Element {
        return (<div>
            <RaisedButton
                primary={true}
                label="Create New"
                style={style}
                onClick={this.onClick}
                icon={<AddIcon />}
            />
            <AddBranchPopup
                isOpen={this.state.showPopup}
                allBranches={this.props.branches}
                allowSelectExisting={true}
                onAdd={this.addNewBranch}
                onCancel={this.cancelAddNew}
                onSelect={this.selectBranch}
            />
        </div>);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        branches: state.branches,
        currentApp: state.currentApp
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        routeActions: bindActionCreators(routeActions, dispatch),
        branchActions: bindActionCreators(branchActions, dispatch),
        configActions: bindActionCreators(configActions, dispatch),
        workflowActions: bindActionCreators(workflowActions, dispatch)
    });
};
export default connect(mapStateToProps, mapDispatchToProps)(AddConfig);


