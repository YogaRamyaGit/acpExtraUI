import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as appActions from '../home/appsActions';
import authConfig from '../user/authConfig';
import * as configActions from './configActions';
import * as editableConfigActions from '../editableConfig/editableConfigActions';
import * as branchActions from '../branches/branchActions';
import * as workflowActions from '../workflows/workflowActions';
import AddBranchPopup from '../branches/addBranchPopup';
import { IConfig } from './config';
import ConfigsList from './configsList';
import { Pagination, routeActions } from '../common';

import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    TableRow,
    TableRowColumn,
    IconButton,
    RaisedButton
} from 'material-ui';

interface IConfigContainerProps {
    branch: string;
    branches: any[];
    configs: IConfig[];
    currentApp: any;
    actions: any;
    appActions: any;
    editableConfigActions: any;
    routeActions: any;
    branchActions: any;
    workflowActions: any;
}
interface IConfigContainerState {
    rowsPerPage: number;
    currentPage: number;
    showSelectBranchPopup: boolean;
    editableConfig: IConfig;
}
class ConfigsContainer extends React.Component<IConfigContainerProps, IConfigContainerState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            rowsPerPage: 1000,
            currentPage: 1,
            showSelectBranchPopup: false,
            editableConfig: {}
        };

        this.fetchConfigs = this.fetchConfigs.bind(this);
        this.addNewBranch = this.addNewBranch.bind(this);
        this.cancelAddNew = this.cancelAddNew.bind(this);
        this.selectBranch = this.selectBranch.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.editConfig = this.editConfig.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.copyConfig = this.copyConfig.bind(this);
    }
    public componentWillMount() {
        const { currentApp, branch, configs } = this.props;
        if (!(currentApp && currentApp.id === 'configs-manager')) {
            this.props.appActions.setCurrentApp('configs-manager');
        }

        if (branch && configs.length <= 0){
            this.fetchConfigs(this.state.rowsPerPage, this.state.currentPage, branch);
        }
    }
    public componentWillReceiveProps(nextProps) {
        const newbranchSelected = nextProps.branch !== this.props.branch;
        if (newbranchSelected) {
            this.fetchConfigs(this.state.rowsPerPage, this.state.currentPage, nextProps.branch);
        } 
    }
    private addNewBranch(branchName) {
        // craete new branch, check out and move to edit page
        this.setState({ showSelectBranchPopup: false });
        this.props.branchActions.createBranch(branchName).then(() => {
            this.props.branchActions.setCurrentBranch(branchName);
            // this.editConfig(this.state.editableConfig);
        });
    }
    public selectBranch(branchName) {
        // checkout to selected branch and move to edit page
        this.setState({ showSelectBranchPopup: false });
        this.props.branchActions.setCurrentBranch(branchName);
        // this.editConfig(this.state.editableConfig);
    }
    private editConfig(config) {
        // redirect to edit page
        this.props.editableConfigActions.setEditableConfig(config);
        const feedName = config.subType ? [config.feedType, config.subType].join('_') : config.feedType;
        this.props.routeActions.setRoute('editConfig', { branch: this.props.branch, partner: config.dataPartner, feed: feedName });
    }
    private onEdit(config) {
        this.setState({ editableConfig: config });
        if (this.props.branch === authConfig.baseBranch) {
            // Don't allow user to change the base branch
            this.setState({ showSelectBranchPopup: true });
        } else {
            this.editConfig(config);
        }
    }
    private copyConfig(config) {
        // redirect to copy page
        this.props.editableConfigActions.setEditableConfig(config);
        this.props.routeActions.setRoute('copyConfig', { branch: this.props.branch, partner: config.dataPartner, feed: config.feedType });
    }
    private onCopy(config) {
        this.setState({ editableConfig: config });
        if (this.props.branch === authConfig.baseBranch) {
            // Don't allow user to change the base branch
            this.setState({ showSelectBranchPopup: true });
        } else {
            this.copyConfig(config);
        }
    }
    private fetchConfigs(rowsPerPage, pageNumber, branch = this.props.branch) {
        this.props.actions.fetchConfigs(branch, rowsPerPage, pageNumber);
        this.props.workflowActions.fetchWorkflows(branch);
    }
    public cancelAddNew() {
        this.setState({ showSelectBranchPopup: false });
    }
    public render(): JSX.Element {
        // Notes - swati
        // Only Configs container is a connected component.
        // Actions has to be performed from container only
        return (<div>
            <AddBranchPopup
                isOpen={this.state.showSelectBranchPopup}
                title={`Must not make changes to "${authConfig.baseBranch}" branch`}
                allBranches={this.props.branches}
                allowSelectExisting={true}
                onAdd={this.addNewBranch}
                onCancel={this.cancelAddNew}
                onSelect={this.selectBranch}
            />
            {!this.props.branch && <h4>Select branch to see configs</h4>}
            {this.props.branch && <div>
                <ConfigsList onEdit={this.onEdit} onCopy={this.onCopy} configs={this.props.configs} />
            </div>}
            { /* Github Contents API ignoring pagination params */}
            {/* <Pagination rowsPerPage={this.state.rowsPerPage} currentPage={this.state.currentPage} onChange={this.fetchConfigs} /> */}
        </div>);
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        branch: state.currentBranch,
        branches: state.branches,
        configs: state.configs,
        currentApp: state.currentApp
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        actions: bindActionCreators(configActions, dispatch),
        editableConfigActions: bindActionCreators(editableConfigActions, dispatch),
        routeActions: bindActionCreators(routeActions, dispatch),
        branchActions: bindActionCreators(branchActions, dispatch),
        workflowActions: bindActionCreators(workflowActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    });
};
export default connect(mapStateToProps, mapDispatchToProps)(ConfigsContainer);
