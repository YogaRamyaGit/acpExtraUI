import * as React from 'react';
import * as _ from 'lodash';
import {
    AutoComplete,
    SelectField,
    MenuItem,
    TextField,
    RaisedButton
} from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DoneIcon from 'material-ui/svg-icons/action/done';

import style from './directMappingStyle';

interface IDirectMappingFormProps {
    targetColumns: string[];
    sourceLayout: any[];
    layoutType: string;
    onSave: (target: string, source: any, defaultValue: string) => void;
    onCancel: () => void;
}

interface IDirectMappingFormState {
    targetColumn: string;
    source: any;
    defaultValue: string;
    errors: any;
}

export default class DirectMappingForm extends React.Component<IDirectMappingFormProps, IDirectMappingFormState> {
    constructor(props, context) {
        super(props, context);

        this.onChangeSource = this.onChangeSource.bind(this);
        this.setDefaultValue = this.setDefaultValue.bind(this);
        this.updateTargetColumn = this.updateTargetColumn.bind(this);
        this.onSave = this.onSave.bind(this);
        this.setEnd = this.setEnd.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setStart = this.setStart.bind(this);

        this.state = {
            targetColumn: '',
            source: {},
            defaultValue: '',
            errors: {}
        };
    }
    private updateTargetColumn(targetColumn) {
        this.setState({ targetColumn });
    }
    private onChangeSource(event, index, value) {
        this.setState({ source: this.props.sourceLayout[index] });
    }
    private setDefaultValue(event, defaultValue) {
        this.setState({ defaultValue });
    }
    private setStart(event, start) {
        const { source } = this.state;
        source.start = parseInt(start, 10);

        this.setState({ source });
    }
    private setEnd(event, end) {
        const { source } = this.state;
        source.end = parseInt(end, 10);

        this.setState({ source });
    }
    private setPosition(event, position) {
        const { source } = this.state;
        source.position = parseInt(position, 10);

        this.setState({ source });
    }
    private onSave() {
        const { targetColumn, source, defaultValue } = this.state;
        const { layoutType } = this.props;
        let errors = this.state.errors;
        const mandatoryFields = ['targetColumn', 'source'];
        // reset errors
        errors = {};
        // validate the fields
        _.forEach(mandatoryFields, field => {
            if (!this.state[field]) {
                errors[field] = 'required';
            } else if (field === 'source') {
                if (this.props.sourceLayout.length > 0) {
                    if (!this.state.source.name) {
                        errors['source'] = 'required';
                    }
                } else if (layoutType === 'fixedWidth') {
                    ['start', 'end'].forEach(attr => {
                        if (isNaN(parseInt(this.state.source[attr], 10))) {
                            errors[attr] = 'required';
                        }
                    });
                } else if (layoutType === 'delimited') {
                    if (isNaN(parseInt(this.state.source.position, 10))) {
                        errors['position'] = 'required';
                    }
                }
            }
        });

        // additional validation: validate start is less than end
        if (layoutType === 'fixedWidth') {
            const startAndEndPresent = !isNaN(parseInt(source.start, 10)) && !isNaN(parseInt(source.end, 10));
            if (startAndEndPresent && (source.start > source.end)) {
                errors['start'] = 'invalid';
                errors['end'] = 'invalid';
            }
        }

        this.setState({ errors });

        if (_.values(errors).length === 0) {
            this.props.onSave(targetColumn, source, defaultValue);
        }
    }
    private filterOptions(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    public render(): JSX.Element {
        return <div style={style.formContainer}>
            <form className="row">
                <div className="col-md-4">
                    <AutoComplete
                        floatingLabelText="Target Column"
                        floatingLabelFixed={true}
                        errorText={this.state.errors.targetColumn}
                        searchText={this.state.targetColumn}
                        onUpdateInput={this.updateTargetColumn}
                        dataSource={this.props.targetColumns}
                        filter={this.filterOptions}
                        openOnFocus={true}
                        fullWidth={true}
                    />
                </div>
                {this.props.sourceLayout.length > 0 && <div className="col-md-4">
                    <SelectField
                        floatingLabelText="Source Column"
                        floatingLabelFixed={true}
                        value={this.state.source.name}
                        errorText={this.state.errors.source}
                        onChange={this.onChangeSource}
                        fullWidth={true}
                    >
                        {_.map(this.props.sourceLayout, source => {
                            const text = source.name;
                            return <MenuItem key={text} value={text} primaryText={text} />;
                        })}
                    </SelectField>
                </div>}
                {(this.props.sourceLayout.length <= 0 && this.props.layoutType === 'fixedWidth') && <div className="col-md-2">
                    <TextField
                        name="start"
                        type="number"
                        min={0}
                        step={1}
                        value={this.state.source.start}
                        onChange={this.setStart}
                        floatingLabelText="Start"
                        floatingLabelFixed={true}
                        errorText={this.state.errors.start}
                        fullWidth={true}
                    />
                </div>}
                {(this.props.sourceLayout.length <= 0 && this.props.layoutType === 'fixedWidth') && <div className="col-md-2">
                    <TextField
                        name="end"
                        type="number"
                        min={this.state.source.start || 0}
                        step={1}
                        value={this.state.source.end}
                        onChange={this.setEnd}
                        floatingLabelText="End"
                        floatingLabelFixed={true}
                        errorText={this.state.errors.end}
                        fullWidth={true}
                    />
                </div>}
                {(this.props.sourceLayout.length <= 0 && this.props.layoutType === 'delimited') && <div className="col-md-4">
                    <TextField
                        name="position"
                        type="number"
                        min={0}
                        step={1}
                        value={this.state.source.position}
                        onChange={this.setPosition}
                        floatingLabelText="Position"
                        floatingLabelFixed={true}
                        errorText={this.state.errors.position}
                        fullWidth={true}
                    />
                </div>}
                <div className="col-md-2">
                    <TextField
                        name="default"
                        value={this.state.defaultValue}
                        onChange={this.setDefaultValue}
                        floatingLabelText="Default"
                        floatingLabelFixed={true}
                        fullWidth={true}
                    />
                </div>
                <div className="col-md-2" style={style.submitButtons}>
                    <RaisedButton label="Add" onClick={this.onSave} primary={true} />
                    <RaisedButton label="cancel" onClick={this.props.onCancel} />
                </div>
            </form>
        </div>;
    }
}
