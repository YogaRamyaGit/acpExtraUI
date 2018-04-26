import * as React from 'react';
import * as _ from 'lodash';
import { specialColumnTypes } from '../../targetColumnTypes/alteredColumns';
import helper from '../../helper';

import { SelectField, MenuItem, AutoComplete, IconButton, TextField } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import style from './defaultValueStyle';

interface IDefaultValueRowProps {
    targetColumn: string;
    targetValue: string;
    unMappedTargetColumns: any[];
    allTargetColumns: any[];
    allMappings: any[];
    onChange: (targetColumn: string, defaultValue: any) => void;
}

interface IDefaultValueRowState {
    targetColumn: string;
    value: string;
    errors: any;
}

export default class DefaultValueRow extends React.Component<IDefaultValueRowProps, IDefaultValueRowState> {
    private valueOptions: any[];
    constructor(props, context) {
        super(props, context);

        this.chooseTargetColumn = this.chooseTargetColumn.bind(this);
        this.chooseValue = this.chooseValue.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updateTargetColumn = this.updateTargetColumn.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.getValueOptions = this.getValueOptions.bind(this);

        this.state = {
            targetColumn: this.props.targetColumn || '',
            value: this.props.targetValue || '',
            errors: {}
        };

        this.valueOptions = _.map(this.props.allMappings, mapping => {
            return `$${mapping.name}`;
        });
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            targetColumn: (nextProps.targetColumn || ''),
            value: (nextProps.targetValue || '')
        });
    }
    private chooseTargetColumn(event, index, targetColumn) {
        this.setState({ targetColumn });
        // Update the config
        this.props.onChange(this.props.targetColumn, { [targetColumn]: this.state.value });
    }
    private chooseValue(event, index, value) {
        this.setState({ value });
        // Update the config
        this.props.onChange(this.props.targetColumn, { [this.state.targetColumn]: value });
    }
    private updateValue(value) {
        this.setState({ value });
        // Update the config
        this.props.onChange(this.props.targetColumn, { [this.state.targetColumn]: value });
    }
    private updateTargetColumn(targetColumn) {
        this.setState({ targetColumn });
    }
    private updateConfig() {
        // Update the config
        this.props.onChange(this.props.targetColumn, { [this.state.targetColumn]: this.state.value });
    }
    private onRemove() {
        // remove the config
        this.props.onChange(this.props.targetColumn, {});
    }
    private filterOptions(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    private getValueOptions() {
        const { targetColumn } = this.state;
        const columnInfo: any = _.find(this.props.allTargetColumns, { name: this.state.targetColumn }) || {};
        let options = [];
        if (_.includes(specialColumnTypes, columnInfo.type)) {
            options = _.filter(this.props.allMappings, (mapping) => {
                const target = _.find(this.props.allTargetColumns, { name: mapping.name }) || {};
                return helper.compare(target.type, columnInfo.type);
            });
        } else {
            options = this.props.allMappings;
        }

        return _.map(options, (option: any) => {
            return `$${option.name}`;
        });
    }
    public render(): JSX.Element {
        const targetInfo: any = _.find(this.props.allTargetColumns, { name: this.state.targetColumn }) || {};
        return (<div className="row">
            <div className="col-md-4">
                <AutoComplete
                    floatingLabelText="Target Column"
                    floatingLabelFixed={true}
                    errorText={this.state.errors.targetColumn}
                    searchText={this.state.targetColumn}
                    onUpdateInput={this.updateTargetColumn}
                    onBlur={this.updateConfig}
                    dataSource={_.map(this.props.unMappedTargetColumns, 'name')}
                    filter={this.filterOptions}
                    openOnFocus={true}
                    fullWidth={true}
                />
            </div>
            <div className="col-md-4">
                {!(targetInfo.nominal_values && targetInfo.nominal_values.length) &&
                    <AutoComplete
                        floatingLabelText="Value"
                        floatingLabelFixed={true}
                        errorText={this.state.errors.value}
                        searchText={this.state.value}
                        onUpdateInput={this.updateValue}
                        dataSource={this.getValueOptions()}
                        filter={this.filterOptions}
                        openOnFocus={true}
                        fullWidth={true}
                    />}

                {(targetInfo.nominal_values && targetInfo.nominal_values.length) &&
                    <SelectField
                        floatingLabelText="Value"
                        value={this.state.value}
                        onChange={this.chooseValue}
                        fullWidth={true}
                    >
                        {/* <MenuItem value="" PrimaryText=" " /> */}
                        {_.map(targetInfo.nominal_values, (value, index) => {
                            return <MenuItem key={index} value={value} primaryText={value} />;
                        })}
                    </SelectField>}
            </div>
            <div className="col-md-3">
                <IconButton tooltip="Remove" onClick={this.onRemove} style={style.deleteButton} >
                    <ClearIcon />
                </IconButton>
            </div>
        </div>);
    }
}
