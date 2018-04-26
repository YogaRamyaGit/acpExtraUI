import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RaisedButton } from 'material-ui';
import GithubIcon from '../common/githubIcon';

import * as BranchActions from '../branches/branchActions';
import * as ConfigActions from '../configs/configActions';
import * as workflowActions from '../workflows/workflowActions';

interface ISyncConfigsProps {
    currentBranch: string;
    currentApp: any;
    branchActions: any;
    configActions: any;
    workflowActions: any;
}

const style: { [key: string]: React.CSSProperties } = {
    pullContentButton: {
        margin: '0 5px',
        height: 36,
        display: 'inline-block',
        position: 'relative',
        top: -17
    }
};

class SyncConfigs extends React.Component<ISyncConfigsProps, null> {
    constructor(props, context) {
        super(props, context);
        this.syncWithGithub = this.syncWithGithub.bind(this);
        this.fetchRecords = this.fetchRecords.bind(this);
    }
    private fetchRecords() {
        const { currentApp } = this.props;

        switch (currentApp.id) {
            case 'workflow-manager':
                this.props.workflowActions.fetchWorkflows(this.props.currentBranch);
                break;
            case 'configs-manager':
                this.props.configActions.fetchConfigs(this.props.currentBranch);
                break;
            default:
                this.props.configActions.fetchConfigs(this.props.currentBranch);
        }

    }
    private syncWithGithub() {
        this.props.branchActions.fetchBranches(this.props.currentApp).then(() => {
            if (this.props.currentBranch) {
                this.fetchRecords();
            }
        });
    }
    public render(): JSX.Element {
        return (<RaisedButton
            primary={true}
            label="Sync with Github"
            style={style.pullContentButton}
            onClick={this.syncWithGithub}
            icon={<GithubIcon height={20} width={20} />}
        />);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        currentBranch: state.currentBranch,
        currentApp: state.currentApp
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        branchActions: bindActionCreators(BranchActions, dispatch),
        configActions: bindActionCreators(ConfigActions, dispatch),
        workflowActions: bindActionCreators(workflowActions, dispatch)
    });
};
export default connect(mapStateToProps, mapDispatchToProps)(SyncConfigs);

