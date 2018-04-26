import * as React from 'react';
import * as _ from 'lodash';
import authConfig from '../user/authConfig';

import { Dialog, FlatButton, TextField, SelectField, MenuItem } from 'material-ui';

interface IBranch {
    name: string;
    commit: any;
}

interface IAddBranchProps {
    title?: string;
    onSelect?: (branch) => void;
    allowSelectExisting: boolean;
    onAdd: (branch) => void;
    onCancel: () => void;
    allBranches: IBranch[];
    isOpen: boolean;
}

interface IAddBranchState {
    newBranch: string;
    selectedBranch: string;
    errors: any;
}

export default class AddBranchPopup extends React.Component<IAddBranchProps, IAddBranchState> {
    constructor(props, context) {
        super(props, context);

        this.handleOk = this.handleOk.bind(this);
        this.setBranchName = this.setBranchName.bind(this);
        this.chooseBranch = this.chooseBranch.bind(this);

        this.state = { newBranch: '', selectedBranch: '', errors: {} };
    }
    private handleOk() {
        // validate the branch name does not clash
        let { errors } = this.state;

        // reset errors
        errors = {};

        if (this.state.newBranch) {
            if (_.includes(this.state.newBranch, " ")) {
                errors['newBranch'] = 'space not allowed';
            } else if (_.find(this.props.allBranches, { name: this.state.newBranch })) {
                errors['newBranch'] = 'already present';
            }
            this.setState({ errors });

            if (_.values(errors).length === 0) {
                this.props.onAdd(this.state.newBranch);
            }
        } else if (this.state.selectedBranch) {
            this.props.onSelect(this.state.selectedBranch);
        }
    }
    private setBranchName(event, newBranch) {
        this.setState({ newBranch, selectedBranch: '' });
    }
    private chooseBranch(event, index, selectedBranch) {
        this.setState({ selectedBranch, newBranch: '' });
    }
    public render(): JSX.Element {
        const actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                onClick={this.props.onCancel}
            />,
            <FlatButton
                key="ok"
                label="Ok"
                primary={true}
                disabled={!(this.state.newBranch || this.state.selectedBranch)}
                keyboardFocused={true}
                onClick={this.handleOk}
            />
        ];
        return (
            <Dialog
                title={this.props.title || ''}
                actions={actions}
                modal={false}
                open={this.props.isOpen}
            >
                <div>
                    <div>
                        <TextField
                            floatingLabelText="Create New Branch"
                            floatingLabelFixed={true}
                            hintText="Name of the branch"
                            value={this.state.newBranch}
                            onChange={this.setBranchName}
                            errorText={this.state.errors.newBranch}
                        />
                    </div>

                    {this.props.allowSelectExisting && <SelectField
                        floatingLabelText="Select Branch"
                        value={this.state.selectedBranch}
                        onChange={this.chooseBranch}
                    >
                        <MenuItem value={''} primaryText=" " />
                        {_.map(this.props.allBranches, (branch) => {
                            return <MenuItem key={branch.name} value={branch.name} primaryText={branch.name} disabled={branch.name === authConfig.baseBranch} />;
                        })}
                    </SelectField>}
                </div>
            </Dialog>
        );
    }
}
