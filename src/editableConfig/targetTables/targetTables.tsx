import * as React from 'react';
import * as _ from 'lodash';
import { IConfig } from '../../configs/config';

import ActionButtons from '../editableConfigActionButtons';
import TargetTableRow from './targetTableRow';
import * as targetTableActions from './targetTablesAction';
import SelectAllTables from './selectAllTables';
import style from './targetTablesStyle';
import AddTargetTableForm from './addTargetTableForm';
import { AddButton } from '../common';

interface IEditConfigProps {
    config: IConfig;
    allTables: string[];
    onSave: (any) => void;
}

interface ITargetTableState {
    allTargetTables: string[];
    targetTables: string[];
    allSelected: boolean;
    showNewForm: boolean;
}

export default class DirectMapping extends React.Component<IEditConfigProps, ITargetTableState> {
    constructor(props, context) {
        super(props, context);

        this.isSelected = this.isSelected.bind(this);
        this.selectTable = this.selectTable.bind(this);
        this.onSave = this.onSave.bind(this);
        this.toggleSelectAll = this.toggleSelectAll.bind(this);
        this.showNewForm = this.showNewForm.bind(this);
        this.addNewTargetTable = this.addNewTargetTable.bind(this);
        this.getOptions = this.getOptions.bind(this);

        const allTargetTables = _.assign([], _.union((this.props.config.allTargetTables || []), (this.props.config.targetTables || [])));

        this.state = {
            allTargetTables: allTargetTables,
            targetTables: this.props.config.targetTables || [],
            allSelected: (this.props.config.targetTables.length === allTargetTables.length),
            showNewForm: false
        };
    }
    public componentWillReceiveProps(nextProps) {
        const allTargetTables: string[] = _.assign([], _.union((nextProps.config.allTargetTables || []), (nextProps.config.targetTables || [])));

        this.setState({
            allTargetTables: allTargetTables,
            targetTables: _.assign([], nextProps.config.targetTables || []),
            allSelected: (nextProps.config.targetTables.length === allTargetTables.length)
        });
    }
    private isSelected(tableName): boolean {
        return _.includes(this.state.targetTables, tableName);
    }
    public selectTable(tableName) {
        const { targetTables } = this.state;

        if (_.includes(targetTables, tableName)) {
            _.remove(targetTables, table => table === tableName);
        } else {
            targetTables.push(tableName);
        }

        this.setState({ targetTables });
    }
    public onSave() {
        targetTableActions.updateTargetTables(this.props.config, this.state.targetTables);
        this.props.onSave(this.props.config);
    }
    public toggleSelectAll(event: any, selectAll: boolean) {
        let { targetTables } = this.state;
        const { allSelected } = this.state;

        targetTables = selectAll ? _.assign([], (this.state.allTargetTables || [])) : [];

        this.setState({ targetTables, allSelected: !allSelected });
    }
    public showNewForm() {
        this.setState({ showNewForm: true });
    }
    public addNewTargetTable(tableName: string) {
        const { allTargetTables, targetTables } = this.state;
        targetTables.push(tableName);
        allTargetTables.push(tableName);

        this.setState({ allTargetTables, targetTables, showNewForm: false });
    }
    private getOptions(): string[] {
        return _.difference(this.props.allTables, this.state.allTargetTables);
    }
    public render(): JSX.Element {
        return (<div>
            <SelectAllTables checked={this.state.allTargetTables.length === this.state.targetTables.length} onChange={this.toggleSelectAll} />
            <div style={style.rowsContainer}>
                {_.map(this.state.allTargetTables, (table, index) => {
                    return (<TargetTableRow
                        key={index}
                        tableName={table}
                        checked={this.isSelected(table)}
                        onChange={this.selectTable}
                    />);
                })}
            </div>

            <AddButton label="Add Table" onClick={this.showNewForm} />

            {this.state.showNewForm && <AddTargetTableForm options={this.getOptions()} onAdd={this.addNewTargetTable} />}

            <ActionButtons
                onSave={this.onSave}
            />
        </div>);
    }
}
