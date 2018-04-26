import * as React from 'react';
import { includes, filter, map, find } from 'lodash';
import { specialColumnTypes } from '../../targetColumnTypes/alteredColumns';
import helper from '../../helper';

import style from './pivotConfigStyle';
import { SelectField, MenuItem, AutoComplete, IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

interface IPivotMappingRowProps {
    columnName: string;
    value: string;
    allColumns: any[];
    allMappedValues: any[];
    onChange: (columnName: string, updatedColumn: string, value: string) => void;
    onRemove: (columnName: string) => void;
}

interface IPivotMappingRowState {
    columnName: string;
    value: string;
}

export default class PivotMappingRow extends React.Component<IPivotMappingRowProps, IPivotMappingRowState> {
    constructor(props, context) {
        super(props, context);

        this.chooseColumnName = this.chooseColumnName.bind(this);
        this.chooseValue = this.chooseValue.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.getValueOptions = this.getValueOptions.bind(this);
        this.removeColumn = this.removeColumn.bind(this);

        this.state = {
            columnName: this.props.columnName || '',
            value: this.props.value || ''
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            columnName: nextProps.columnName || '',
            value: nextProps.value || ''
        });
    }
    private removeColumn() {
        this.props.onRemove(this.props.columnName);
    }
    private chooseColumnName(event, index, columnName) {
        this.setState({ columnName });

        this.props.onChange(this.props.columnName, columnName, this.state.value);
    }
    private chooseValue(event, index, value) {
        this.setState({ value });

        this.props.onChange(this.props.columnName, this.state.columnName, value);
    }
    private updateValue(value) {
        this.setState({ value });
    }
    private updateConfig() {
        this.props.onChange(this.props.columnName, this.state.columnName, this.state.value);
    }
    private filterOptions(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    private hasNominalValue(mappedColumn: any) {
        return !!mappedColumn.nominal_values && (mappedColumn.nominal_values.length > 0);
    }
    private getValueOptions(mappedColumn: any) {
        const valueOptions = includes(specialColumnTypes, mappedColumn.type) ?
            filter(this.props.allMappedValues, value => helper.compare(value.type, mappedColumn.type)) : this.props.allMappedValues;

        return map(valueOptions, (value: any) => `$${value.name}`);
    }
    public render(): JSX.Element {
        const mappedColumn: any = find(this.props.allColumns, { name: this.state.columnName }) || {};

        return <div style={style.mappingRow}>
            <div className="col-md-4">
                <SelectField
                    floatingLabelText="ColumnName"
                    floatingLabelFixed={true}
                    value={this.state.columnName}
                    onChange={this.chooseColumnName}
                    fullWidth={true}
                >
                    {map(this.props.allColumns, (column, index) => {
                        return <MenuItem key={index} value={column.name} primaryText={column.name} />;
                    })}
                </SelectField>
            </div>
            <div className="col-md-4">
                {this.hasNominalValue(mappedColumn) &&
                    <SelectField
                        floatingLabelText="Value"
                        floatingLabelFixed={true}
                        value={this.state.value}
                        onChange={this.chooseValue}
                        fullWidth={true}
                    >
                        {map(mappedColumn.nominal_values, (value, index) => {
                            return <MenuItem key={index} value={value} primaryText={value} />;
                        })}
                    </SelectField>
                }
                {!this.hasNominalValue(mappedColumn) &&
                    <AutoComplete
                        floatingLabelText="Value"
                        floatingLabelFixed={true}
                        searchText={this.state.value}
                        onUpdateInput={this.updateValue}
                        onBlur={this.updateConfig}
                        dataSource={this.getValueOptions(mappedColumn)}
                        filter={this.filterOptions}
                        openOnFocus={true}
                        fullWidth={true}
                    />
                }
            </div>
            <div className="col-md-4">
                <IconButton onClick={this.removeColumn} style={style.clearIcon}>
                    <ClearIcon />
                </IconButton>
            </div>
        </div>;
    }
}
