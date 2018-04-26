import * as React from 'react';
import { map, includes, indexOf } from 'lodash';
import { Card, SelectField, MenuItem, AutoComplete, IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import { TagsManager } from '../common';
import style from './businessRuleStyle';

interface IBusinessRuleRowProps {
    rule: string;
    index: number;
    columns: string[];
    allColumns: any[];
    allRules: any[];
    onChange: (index: number, rule: string, columns: string[]) => void;
    onRemove: (index: number) => void;
}

interface IBusinessRuleRowState {
    rule: string;
    columns: string[];
}

export default class BusinessRuleRow extends React.Component<IBusinessRuleRowProps, IBusinessRuleRowState>{
    constructor(props, context) {
        super(props, context);

        this.chooseRule = this.chooseRule.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.removeColumn = this.removeColumn.bind(this);
        this.updateRow = this.updateRow.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.state = {
            rule: this.props.rule || '',
            columns: this.props.columns || []
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            rule: nextProps.rule || '',
            columns: nextProps.columns || []
        });
    }
    private updateRow(rule, columns) {
        this.props.onChange(this.props.index, rule, this.state.columns);
    }
    private chooseRule(event, index, rule) {
        this.setState({ rule });
        this.updateRow(rule, this.state.columns);
    }
    private addColumn(columnName) {
        const { columns } = this.state;
        if (!includes(columns, columnName)) {
            columns.push(columnName);
        }

        this.setState({ columns });
        this.updateRow(this.state.rule, columns);
    }
    private removeColumn(columnName) {
        const { columns } = this.state;
        const columnIndex = indexOf(columns, columnName);

        if (columnIndex >= 0) {
            columns.splice(columnIndex, 1);
        }

        this.setState({ columns });
        this.updateRow(this.state.rule, columns);
    }
    private onRemove() {
        this.props.onRemove(this.props.index);
    }
    public render(): JSX.Element {
        return (<Card containerStyle={style.configCard}>
            <div>
                <div style={style.iconContainer}>
                    <IconButton tooltip="Remove" onClick={this.onRemove} style={style.deleteButton} >
                        <ClearIcon />
                    </IconButton>
                </div>
                <SelectField
                    floatingLabelText="Business Rule"
                    value={this.state.rule}
                    onChange={this.chooseRule}
                >
                    {map((this.props.allRules || []), (ruleInfo: any, index: number) => {
                        return <MenuItem key={index} value={ruleInfo.name} primaryText={ruleInfo.name} />;
                    })}
                </SelectField>
                <TagsManager
                    title={"Columns"}
                    tags={this.state.columns}
                    tagOptions={this.props.allColumns.map(column => `$${column.name}`)}
                    onAdd={this.addColumn}
                    onRemove={this.removeColumn}
                />
            </div>
        </Card>);
    }
}
