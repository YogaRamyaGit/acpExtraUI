import * as React from 'react';
import * as _ from 'lodash';

import style from './concatenationStyle';
import { SelectField, MenuItem, TextField, AutoComplete, Chip, IconButton, Card } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

interface IConcatenationRowProps {
    index: number;
    target_field?: string;
    fields?: string[];
    delimiter?: string;
    allTargetColumns: string[];
    allMappings: string[];
    onChange: (index: number, newTargetFIeld: string, fields: string[], delimiter: string) => void;
    onRemove: (index: number) => void;
}

interface IConcatenationRowState {
    targetField: string;
    fields: string[];
    delimiter: string;
    searchText: string;
}

export default class ConcatenationRow extends React.Component<IConcatenationRowProps, IConcatenationRowState> {
    private fieldOptions: string[];
    constructor(props, context) {
        super(props, context);

        this.chooseTargetField = this.chooseTargetField.bind(this);
        this.updateTargetField = this.updateTargetField.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.setDelimiter = this.setDelimiter.bind(this);
        this.removeField = this.removeField.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.filterOptions = this.filterOptions.bind(this);
        this.updateFields = this.updateFields.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.getFieldOptions = this.getFieldOptions.bind(this);
        this.getColumnOptions = this.getColumnOptions.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.state = {
            targetField: props.target_field || '',
            fields: props.fields || [],
            delimiter: props.delimiter || '',
            searchText: ''
        };

        this.fieldOptions = _.map(this.props.allMappings, mapping => {
            return `$${mapping}`;
        });

    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            targetField: nextProps.target_field || '',
            fields: nextProps.fields || [],
            delimiter: nextProps.delimiter || '',
        });
    }
    private chooseTargetField(event, index, targetField) {
        this.setState({ targetField });
        this.props.onChange(
            this.props.index,
            targetField,
            this.state.fields,
            this.state.delimiter
        );
    }
    private setDelimiter(event, delimiter) {
        this.setState({ delimiter });
        this.props.onChange(
            this.props.index,
            this.state.targetField,
            this.state.fields,
            delimiter
        );
    }
    private removeField(field) {
        const { fields } = this.state;

        _.remove(fields, item => item === field);
        this.setState({ fields });
        this.props.onChange(
            this.props.index,
            this.state.targetField,
            fields,
            this.state.delimiter
        );
    }
    private updateFields() {
        const { fields, searchText } = this.state;

        fields.push(searchText);
        this.setState({ fields, searchText: '' });
        this.props.onChange(
            this.props.index,
            this.state.targetField,
            fields,
            this.state.delimiter
        );
    }
    private updateValue(searchText) {
        this.setState({ searchText });
    }
    private updateTargetField(targetField) {
        this.setState({ targetField });
    }
    private updateConfig() {
        this.props.onChange(
            this.props.index,
            this.state.targetField,
            this.state.fields,
            this.state.delimiter
        );
    }
    private filterOptions(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    private onKeyUp(event) {
        const endKeys = [32];

        if (_.includes(endKeys, event.keyCode)) {
            this.updateFields();
        }
    }
    private getFieldOptions() {
        return _.difference(this.fieldOptions, this.state.fields);
    }
    private getColumnOptions() {
        return _.map(this.props.allTargetColumns, (column: any) => column.name);
    }
    private onRemove() {
        this.props.onRemove(this.props.index);
    }
    public render(): JSX.Element {
        return (<Card containerStyle={style.configCard}>
            <div style={style.rowContainer}>
                <div className="row">
                    <div className="col-md-4">
                        <AutoComplete
                            floatingLabelText="Target Field"
                            floatingLabelFixed={true}
                            searchText={this.state.targetField}
                            onUpdateInput={this.updateTargetField}
                            onBlur={this.updateConfig}
                            dataSource={this.getColumnOptions()}
                            filter={this.filterOptions}
                            openOnFocus={true}
                            fullWidth={true}
                        />
                    </div>
                    <div className="col-md-4">
                        <TextField
                            floatingLabelText="Separator"
                            floatingLabelFixed={true}
                            value={this.state.delimiter}
                            onChange={this.setDelimiter}
                            fullWidth={true}
                        />
                    </div>
                    <div style={style.iconContainer}>
                        <IconButton tooltip="Remove" onClick={this.onRemove} style={style.deleteButton} >
                            <ClearIcon />
                        </IconButton>
                    </div>
                </div>
                <div>
                    <label>Fields</label>
                    <div style={style.fieldsContainer}>
                        {_.map(this.state.fields, (field, index) => {
                            return <Chip key={index} style={style.fieldChip} onRequestDelete={() => this.removeField(field)}>{field}</Chip>;
                        })}
                        <AutoComplete
                            style={style.autoComplete}
                            hintText="Add New"
                            searchText={this.state.searchText}
                            onUpdateInput={this.updateValue}
                            onNewRequest={this.updateFields}
                            dataSource={this.getFieldOptions()}
                            filter={this.filterOptions}
                            openOnFocus={true}
                            onKeyUp={this.onKeyUp}
                        />
                    </div>
                </div>
            </div>
        </Card>);
    }
}
