import * as React from 'react';
import * as _ from 'lodash';
import { IConfig } from '../../configs/config';
import { AddButton } from '../common';

import ActionButtons from '../editableConfigActionButtons';
import PivotConfigsList from './pivotConfigsList';
import * as pivotConfigActions from './pivotConfigActions';

interface IEditConfigProps {
    config: IConfig;
    onSave: (any) => void;
}

interface IPivotConfig {
    table_name?: string;
    field_mapping: any[];
}

interface IPivotConfigState {
    pivotConfigs: IPivotConfig[];
}

export default class PivotConfigs extends React.Component<IEditConfigProps, IPivotConfigState> {
    constructor(props, context) {
        super(props, context);

        this.updatePivot = this.updatePivot.bind(this);
        this.removePivot = this.removePivot.bind(this);
        this.showNewForm = this.showNewForm.bind(this);
        this.onSave = this.onSave.bind(this);

        this.state = {
            pivotConfigs: this.props.config.pivotConfigs
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            pivotConfigs: nextProps.config.pivotConfigs || []
        });
    }
    private removePivot(tableName: string) {
        const { pivotConfigs } = this.state;

        const index = _.findIndex(pivotConfigs, config => config.table_name === tableName);

        if (index >= 0) {
            pivotConfigs.splice(index, 1);
        }

        this.setState({ pivotConfigs });
    }
    private updatePivot(tableName: string, newTableName: string, mapping: any[]) {
        const { pivotConfigs } = this.state;

        const index = _.findIndex(pivotConfigs, config => config.table_name === tableName);

        if (index >= 0) {
            pivotConfigs[index] = {
                table_name: newTableName,
                field_mapping: mapping
            };
        } else {
            pivotConfigs.push({
                table_name: newTableName,
                field_mapping: mapping
            });
        }

        this.setState({ pivotConfigs });
    }
    private showNewForm() {
        const newConfig = {
            table_name: '',
            field_mapping: [{ '': '' }]
        };

        const { pivotConfigs } = this.state;

        if (!_.find(pivotConfigs, { table_name: newConfig.table_name })) {
            pivotConfigs.unshift(newConfig);
        }

        this.setState({ pivotConfigs });
    }
    private onSave() {
        pivotConfigActions.updatePivotConfigs(this.props.config, this.state.pivotConfigs);

        this.props.onSave(this.props.config);
    }
    public render(): JSX.Element {
        return (<div>
            <AddButton label="Add Pivot" onClick={this.showNewForm} />

            <PivotConfigsList
                config={this.props.config}
                pivotConfigs={this.state.pivotConfigs}
                onChange={this.updatePivot}
                onRemove={this.removePivot}
            />

            {this.state.pivotConfigs.length > 0 &&
                <ActionButtons
                    onSave={this.onSave}
                />}
        </div>);
    }
}
