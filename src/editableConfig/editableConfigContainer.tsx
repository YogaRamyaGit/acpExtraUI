import * as React from 'react';
import { assign, find, map, keys, includes, compact, findIndex } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
    StepButton,
    RaisedButton,
    Snackbar
} from 'material-ui';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';

import { IConfig } from '../configs/config';
import * as editableConfigActions from './editableConfigActions';
import * as branchActions from '../branches/branchActions';
import * as configActions from '../configs/configActions';
import * as allTableActions from '../allTables/allTableActions';
import * as businessRuleActions from '../businessRules/businessRuleActions';
import EditableConfigStep from './editableConfigStep';
import style from './editableConfigStyle';
import { BranchInfo, Logs } from '../common';
import { FileContent, Sidebar } from './common';
import { filters } from '../constants';
import helper from '../helper';

interface IEditableConfigProps {
    editableConfig: IConfig;
    configs: IConfig[];
    currentBranch: string;
    branches: any[];
    allTables: string[];
    actions: any;
    branchActions: any;
    configActions: any;
    tableActions: any;
    businessRuleActions: any;
    businessRules: any[];
}

interface IEditableConfigState {
    currentStep: any;
    showSuccessMessage: boolean;
    message: string;
    showFileContent: boolean;
    showSidebar: boolean;
    showLogs: boolean;
}

class EditableConfigContainer extends React.Component<IEditableConfigProps, IEditableConfigState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            currentStep: props.editableConfig.steps[0] || {},
            showSuccessMessage: false,
            message: '',
            showFileContent: false,
            showSidebar: true,
            showLogs: false
        };

        this.onSave = this.onSave.bind(this);
        this.handleMessengerClose = this.handleMessengerClose.bind(this);
        this.shouldEditFilters = this.shouldEditFilters.bind(this);
        this.shouldEditDirectMapping = this.shouldEditDirectMapping.bind(this);
        this.prepareStep = this.prepareStep.bind(this);
        this.showContent = this.showContent.bind(this);
        this.publishContent = this.publishContent.bind(this);
        this.hideFileContent = this.hideFileContent.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.moveToNextStep = this.moveToNextStep.bind(this);
        this.getCurrentBranch = this.getCurrentBranch.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.onExecute = this.onExecute.bind(this);
    }
    public componentWillReceiveProps(nextProps) {
        const { currentStep } = this.state;
        if (!currentStep.id) {
            this.setState({ currentStep: nextProps.editableConfig.steps[0] || {} });
        }
    }
    private shouldEditFilters(): boolean {
        const hasMapping = this.props.editableConfig.directMapping && (this.props.editableConfig.directMapping.length > 0);
        const hasTargetTables = this.props.editableConfig.targetTables && (this.props.editableConfig.targetTables.length > 0);
        return hasMapping && hasTargetTables;
    }
    private shouldEditDirectMapping() {
        const hasTargetTables = this.props.editableConfig.targetTables && (this.props.editableConfig.targetTables.length > 0);
        return hasTargetTables;
    }
    private prepareStep(step) {
        const staticSteps = ['layout-config', 'target-tables', 'source-layout'];

        if ((step === 'target-tables') && this.props.editableConfig.allTargetTables.length <= 0) {
            this.props.actions.fetchTargetTables(this.props.editableConfig, this.props.currentBranch);
            if (this.props.allTables.length <= 0) {
                this.props.tableActions.fetchAllTables();
            }
        } else if ((step === 'source-layout') && this.props.editableConfig.sourceLayout.content.length <= 0) {
            this.props.actions.fetchSourceLayout(this.props.editableConfig, this.props.currentBranch);
        } else if (!includes(staticSteps, step) && keys(this.props.editableConfig.targetColumns).length <= 0) {
            this.props.actions.fetchTargetColumns(this.props.editableConfig, this.props.currentBranch);
        }

        if (step === 'business-rules' && this.props.businessRules.length <= 0) {
            this.props.businessRuleActions.fetchBusinessRules();
        }
    }
    private visitStep(nextStep) {
        // Figure out whether to allow user navigate
        const stopEditingFilters = includes(filters, nextStep.type) && !this.shouldEditFilters();
        const stopEditingDirectMapping = nextStep.type === 'direct-mapping' && !this.shouldEditDirectMapping();
        if (stopEditingFilters || stopEditingDirectMapping) {
            return false;
        }

        this.prepareStep(nextStep.type);
        this.setState({ currentStep: nextStep });
    }
    private moveToNextStep() {
        const { currentStep } = this.state;
        const steps = this.props.editableConfig.steps;
        const stepIndex = findIndex(steps, { id: currentStep.id });
        const nextStep = steps[stepIndex + 1];

        if (nextStep) {
            this.visitStep(nextStep);
        }
    }
    private onSave(config) {
        const { currentStep } = this.state;
        if (currentStep.type === 'source-layout') {
            this.props.actions.updateSourceLayout(config, this.props.currentBranch).then(() => {
                this.setState({ showSuccessMessage: true });
                // Move to the next filter
                this.moveToNextStep();
            }).catch(err => {
                console.log('Failed to update');
            });
        } else {
            this.props.actions.updateConfig(config, this.props.currentBranch).then(() => {
                this.setState({ showSuccessMessage: true });
                // Move to the next filter
                this.moveToNextStep();
            }).catch(err => {
                console.log('Failed to update');
            });
        }
    }
    private handleMessengerClose() {
        this.setState({ showSuccessMessage: false, message: '' });
    }
    public componentWillMount() {
        if (!this.props.currentBranch) {
            // restore page behavior if window is reloaded
            const urlParams = compact(window.location.pathname.split('/'));
            const branchName = urlParams[2];
            const partner = urlParams[4];
            const feed = urlParams[6];
            this.props.branchActions.setCurrentBranch(branchName);
            if (this.props.branches.length <= 0) {
                this.props.branchActions.fetchBranches();
            }
            this.props.configActions.fetchConfigs(branchName).then(() => {
                const configName = `${partner}_${feed}.cfg`.toLowerCase(); // config file names are always in lowercase
                const config = find(this.props.configs, { name: configName });
                if (config) {
                    this.props.actions.setEditableConfig(config);
                    this.props.actions.fetchContent(config, branchName).then(() => {
                        if (this.props.editableConfig.sourceLayout.content.length <= 0) {
                            this.props.actions.fetchSourceLayout(this.props.editableConfig, this.props.currentBranch);
                        }
                    });
                }
            });
        }

        if (this.props.editableConfig.path && !this.props.editableConfig.content) {
            this.props.actions.fetchContent(this.props.editableConfig, this.props.currentBranch).then(() => {
                if (this.props.editableConfig.sourceLayout.content.length <= 0) {
                    this.props.actions.fetchSourceLayout(this.props.editableConfig, this.props.currentBranch);
                }
            });
        }
    }
    private showContent() {
        this.setState({ showFileContent: true });
    }
    private updateContent(content: any) {
        this.props.editableConfig.content = content;
        this.setState({ showFileContent: false });
        // push the changes to repo
        this.props.actions.updateConfig(this.props.editableConfig, this.props.currentBranch).then(() => {
            this.setState({ showSuccessMessage: true });
        }).catch(err => {
            console.log('Failed to update');
        });
    }
    private hideFileContent() {
        this.setState({ showFileContent: false });
    }
    private renderMenu(menu) {
        this.visitStep(menu);
    }
    private addFilter(filterName) {
        this.props.editableConfig.addFilter(filterName);
        this.props.actions.updateConfig(this.props.editableConfig, this.props.currentBranch).then(() => {
            this.setState({ showSuccessMessage: true });
            const steps = this.props.editableConfig.steps;
            this.visitStep(steps[steps.length - 1]);
        });
    }
    private removeFilter(filter: any) {
        const { currentStep } = this.state;
        let targetStep: any = currentStep;
        if (filter.removable) {
            // If the current step is being removed, move the user to previous step
            if (filter.id === currentStep.id) {
                const steps = this.props.editableConfig.steps;
                const stepIndex = findIndex(steps, { id: filter.id });
                targetStep = steps[stepIndex - 1];
            }

            this.setState({ currentStep: targetStep });
            this.props.editableConfig.removeFilter(filter.type, filter.index);
            this.props.actions.updateConfig(this.props.editableConfig, this.props.currentBranch).then(() => {
                this.setState({ showSuccessMessage: true });
            });
        }
    }
    private toggleSidebar() {
        const { showSidebar } = this.state;
        this.setState({ showSidebar: !showSidebar });
    }
    private shouldSendNewPullRequest(branch: any) {
        const pullRequestsPresent = branch.pullRequests && branch.pullRequests.length > 0;
        const pullRequestOpen = find(branch.pullRequests || [], { state: 'open' });
        return !pullRequestsPresent || !pullRequestOpen;
    }    
    private onExecute(){
        this.props.actions.copyToCluster(this.props.editableConfig, this.props.currentBranch).then(() => {
            return this.props.actions.runInCluster(this.props.editableConfig);
        }).then(() => {
            this.setState({ showLogs: true, showSuccessMessage: true, message: 'Copied config to EMR cluster'});
        }).catch((error) => {
            console.log('Failed  to copy config');
        });
    }
    private publishContent() {
        const branch = this.getCurrentBranch();
        let successMessage = '';
        let updatePR: Promise<any>;
        if (this.shouldSendNewPullRequest(branch)) {
            updatePR = this.props.branchActions.createPullRequest(this.props.branches, this.props.currentBranch);
            successMessage = 'Created Pull Request';
        } else {
            updatePR = this.props.branchActions.updatePullRequest(this.props.branches, this.props.currentBranch);
            successMessage = 'Updated Pull Request';
        }

        updatePR.then(() => {
            const updatedBranch = this.getCurrentBranch();
            this.setState({ showSuccessMessage: true, message: successMessage });
        });
    }
    private getCurrentBranch() {
        const { branches, currentBranch } = this.props;

        return find(branches, { name: currentBranch }) || { name: currentBranch };
    }
    public render(): JSX.Element {
        return (<div className="edit-config">
            <BranchInfo
                currentBranch={this.getCurrentBranch()}
                dataPartner={this.props.editableConfig.dataPartner}
                feedType={this.props.editableConfig.feedType}
                name={this.props.editableConfig.name}
                enableViewFile={true}
                onView={this.showContent}
                enablePublishChanges={true}
                onPublish={this.publishContent}
                showMenu={true}
                onClickMenu={this.toggleSidebar}
                executable={true}
                onExecute={this.onExecute}
            />

            {this.state.showFileContent &&
                <FileContent
                    content={this.props.editableConfig.content}
                    title={this.props.editableConfig.name}
                    isOpen={this.state.showFileContent}
                    onClose={this.hideFileContent}
                    onUpdate={this.updateContent}
                />
            }
            <div style={style.container}>
                <Sidebar
                    menus={this.props.editableConfig.steps}
                    selectedMenu={this.state.currentStep}
                    onClick={this.renderMenu}
                    onAdd={this.addFilter}
                    onRemove={this.removeFilter}
                    isOpen={this.state.showSidebar}
                />

                {this.props.editableConfig.content && <EditableConfigStep
                    sidebarOpen={this.state.showSidebar}
                    editableConfig={this.props.editableConfig}
                    currentStep={this.state.currentStep}
                    allTables={this.props.allTables}
                    allBusinessRules={this.props.businessRules}
                    onSave={this.onSave}
                    onRemove={this.removeFilter}
                />}

                {this.props.editableConfig.processLogs && <Logs logs={this.props.editableConfig.processLogs} style={this.state.showSidebar ? style.sidebarOpen : style.sidebarClose}/>}
            </div>

            <Snackbar
                open={this.state.showSuccessMessage}
                message={this.state.message || "Updated config successfully"}
                autoHideDuration={2000}
                onRequestClose={this.handleMessengerClose}
            />
        </div>);
    }
}

const mapStateToProps = (state) => {
    return ({
        editableConfig: state.editableConfig,
        configs: state.configs,
        currentBranch: state.currentBranch,
        branches: state.branches,
        allTables: state.allTables,
        businessRules: state.businessRules
    });
};

const mapStateToDispatch = (dispatch) => {
    return {
        actions: bindActionCreators(editableConfigActions, dispatch),
        tableActions: bindActionCreators(allTableActions, dispatch),
        branchActions: bindActionCreators(branchActions, dispatch),
        configActions: bindActionCreators(configActions, dispatch),
        businessRuleActions: bindActionCreators(businessRuleActions, dispatch)
    };
};

export default connect(mapStateToProps, mapStateToDispatch)(EditableConfigContainer);
