import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SelectField, MenuItem, RaisedButton } from 'material-ui';

import * as BranchActions from './branchActions';

const style: React.CSSProperties = {
    display: 'inline-block'
};

interface IBranchSelectorProps {
    branches: string[];
    currentBranch: string;
    currentApp: any;
    actions: any;
}

class BranchSelector extends React.Component<IBranchSelectorProps, null> {
    constructor(props, context) {
        super(props, context);

        this.selectBranch = this.selectBranch.bind(this);
    }
    public componentWillMount() {
        if (this.props.branches.length <= 0) {
            this.props.actions.fetchBranches(this.props.currentApp);
        }
    }
    private selectBranch(event, index, branch) {
        this.props.actions.setCurrentBranch(branch);
    }
    public render(): JSX.Element {
        return (<SelectField
            floatingLabelText="Branch"
            value={this.props.currentBranch}
            onChange={this.selectBranch}
            style={style}
        >
            {_.map(this.props.branches, (branch: any) => {
                return <MenuItem key={branch.name} value={branch.name} primaryText={branch.name} />;
            })}
        </SelectField>);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        branches: state.branches,
        currentBranch: state.currentBranch,
        currentApp: state.currentApp
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        actions: bindActionCreators(BranchActions, dispatch)
    });
};
export default connect(mapStateToProps, mapDispatchToProps)(BranchSelector);
