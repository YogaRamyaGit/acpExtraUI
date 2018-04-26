import * as React from 'react';
import { find, map, values } from 'lodash';
import {
    TableRow,
    TableRowColumn,
    SelectField,
    MenuItem,
    TextField
} from 'material-ui';

import style from './directMappingStyle';

interface ITargetColumn {
    name: string;
    type: string;
    notNull: boolean;
    nominal_values?: string[];
    defaultValue?: string;
    pk?: boolean;
}

interface IDirectMappingRowProps {
    targetColumn: ITargetColumn;
    layoutType: string;
    mapping?: any;
    sourceLayout: any[];
    onChange: (target: string, source: any, defaultValue: string) => void;
}

interface IDirectMappingRowState {
    defaultValue: string;
    currentMapping: any;
    errors: any;
}

export default class DirectMappingRow extends React.Component<IDirectMappingRowProps, IDirectMappingRowState> {
    constructor(props, context) {
        super(props, context);

        this.onChangeSource = this.onChangeSource.bind(this);
        this.setDefaultValue = this.setDefaultValue.bind(this);
        this.updateMapping = this.updateMapping.bind(this);
        this.updateDefaultValue = this.updateDefaultValue.bind(this);
        this.chooseDefaultValue = this.chooseDefaultValue.bind(this);
        this.hasNominalValue = this.hasNominalValue.bind(this);
        this.setStart = this.setStart.bind(this);
        this.setEnd = this.setEnd.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.isMapped = this.isMapped.bind(this);
        this.shouldShowDefaultValue = this.shouldShowDefaultValue.bind(this);
        this.validateMapping = this.validateMapping.bind(this);
        this.isMappingEmpty = this.isMappingEmpty.bind(this);

        this.state = {
            defaultValue: (this.props.mapping.default || ''),
            currentMapping: this.getCurrentMapping(),
            errors: {}
        };
    }
    private getCurrentMapping() {
        let currentMapping = { name: 'unmapped' };
        const startEndPresent = !isNaN(parseInt(this.props.mapping.start, 10)) || !isNaN(parseInt(this.props.mapping.end, 10));
        if (startEndPresent) {
            currentMapping = find(this.props.sourceLayout, { start: this.props.mapping.start, end: this.props.mapping.end }) || { name: 'unmapped', start: this.props.mapping.start, end: this.props.mapping.end };
        } else if (!isNaN(parseInt(this.props.mapping.position, 10))) {
            currentMapping = find(this.props.sourceLayout, { position: this.props.mapping.position }) || { name: 'unmapped', position: this.props.mapping.position };
        }

        return currentMapping;
    }
    private onChangeSource(event, index, value) {
        let { currentMapping, defaultValue } = this.state;
        currentMapping = (value === 'unmapped') ? { name: 'unmapped' } : this.props.sourceLayout[index - 1];
        if (value === 'unmapped') {
            defaultValue = '';
        }
        this.setState({ currentMapping, defaultValue });
        this.updateMapping(currentMapping, defaultValue);
    }
    private setDefaultValue(event, value) {
        this.setState({ defaultValue: value });
    }
    private isMappingEmpty(mapping) {
        const { layoutType } = this.props;
        const startOrEndPresent = isNaN(parseInt(mapping.start, 10)) && isNaN(parseInt(mapping.end, 10));
        return layoutType === 'fixedWidth' ? startOrEndPresent : isNaN(parseInt(mapping.position, 10));
    }
    private validateMapping(mapping) {
        let { errors } = this.state;
        const { layoutType } = this.props;
        let manadatoryFields = [];

        if (this.isMappingEmpty(mapping)) {
            this.setState({ errors: {} });
            return;
        }

        errors = {};
        if (layoutType === 'fixedWidth') {
            manadatoryFields = ['start', 'end'];
        } else if (layoutType === 'delimited') {
            manadatoryFields = ['position'];
        }

        manadatoryFields.forEach(field => {
            if (isNaN(parseInt(mapping[field], 10))) {
                errors[field] = 'required';
            }
        });

        // additional validation: validate start is less than end
        if (layoutType === 'fixedWidth') {
            const startAndEndPresent = !isNaN(parseInt(mapping.start, 10)) && !isNaN(parseInt(mapping.end, 10));
            if (startAndEndPresent && (mapping.start > mapping.end)) {
                errors['start'] = 'invalid';
                errors['end'] = 'invalid';
            }
        }

        this.setState({ errors });
    }
    private setStart(event, start) {
        const { currentMapping } = this.state;
        let { defaultValue } = this.state;
        currentMapping.start = parseInt(start, 10);
        this.validateMapping(currentMapping);

        if (this.isMappingEmpty(currentMapping)) {
            defaultValue = '';
        }

        this.setState({ currentMapping, defaultValue });
    }
    private setEnd(event, end) {
        const { currentMapping } = this.state;
        let { defaultValue } = this.state;
        currentMapping.end = parseInt(end, 10);
        this.validateMapping(currentMapping);
        if (this.isMappingEmpty(currentMapping)) {
            defaultValue = '';
        }
        this.setState({ currentMapping, defaultValue });
    }
    private setPosition(event, position) {
        const { currentMapping } = this.state;
        let { defaultValue } = this.state;
        currentMapping.position = parseInt(position, 10);
        if (this.isMappingEmpty(currentMapping)) {
            defaultValue = '';
        }
        this.setState({ currentMapping, defaultValue });
    }
    private chooseDefaultValue(event, index, defaultValue) {
        this.setState({ defaultValue });
        this.updateMapping(this.state.currentMapping, defaultValue);
    }
    private updateDefaultValue() {
        const { currentMapping, defaultValue } = this.state;
        this.updateMapping(currentMapping, defaultValue);
    }
    private updateMapping(currentMapping, defaultValue) {
        if (values(this.state.errors).length <= 0) {
            this.props.onChange(this.props.targetColumn.name, currentMapping, defaultValue);
        }
    }
    private hasNominalValue(): boolean {
        if (!this.props.targetColumn) {
            return false;
        }

        return !!this.props.targetColumn.nominal_values && (this.props.targetColumn.nominal_values.length > 0);
    }
    private isMapped(): boolean {
        const { currentMapping } = this.state;

        if (this.props.layoutType === 'fixedWidth') {
            const startEndPresent = !isNaN(parseInt(currentMapping.start, 10)) || !isNaN(parseInt(currentMapping.end, 10));
            return (startEndPresent) || currentMapping.name !== 'unmapped';
        } else if (this.props.layoutType === 'delimited') {
            return (!isNaN(parseInt(currentMapping.position, 10))) || currentMapping.name !== 'unmapped';
        }
    }
    private shouldShowDefaultValue() {
        return this.isMapped() || this.props.targetColumn.defaultValue || this.hasNominalValue();
    }

    public render(): JSX.Element {
        let defaultValueField = <TextField
            name="default"
            value={this.state.defaultValue}
            onChange={this.setDefaultValue}
            onBlur={this.updateDefaultValue}
            hintText={(this.props.targetColumn.defaultValue || '').split('\'').join('')} // remove extra single quotes(')
        />;

        if (this.hasNominalValue()) {
            defaultValueField = <SelectField
                style={style.dropdown}
                value={this.state.defaultValue}
                onChange={this.chooseDefaultValue}
                hintText={this.props.targetColumn.defaultValue || ''}
            >
                {map(this.props.targetColumn.nominal_values, (value, index) => {
                    return <MenuItem key={index} value={value} primaryText={value} />;
                })}
            </SelectField>;
        }

        return (<TableRow>
            <TableRowColumn>{this.props.targetColumn.name}{(this.props.targetColumn && this.props.targetColumn.notNull) ? <span style={style.required}>*</span> : ''}</TableRowColumn>
            <TableRowColumn>
                <SelectField
                    floatingLabelText=""
                    value={this.state.currentMapping.name}
                    onChange={this.onChangeSource}
                    disabled={this.props.sourceLayout.length <= 0}
                    style={style.dropdown}
                >
                    <MenuItem key={'unmapped'} value={'unmapped'} primaryText="Not Mapped" />
                    {map(this.props.sourceLayout, (source, index) => {
                        const text = source.name;
                        return <MenuItem key={index} value={text} primaryText={text} />;
                    })}
                </SelectField>
            </TableRowColumn>
            <TableRowColumn>
                {this.shouldShowDefaultValue() &&
                    defaultValueField
                }
            </TableRowColumn>
            {this.props.layoutType === 'fixedWidth' &&
                [<TableRowColumn key="start">
                    <TextField
                        type="number"
                        step={1}
                        name="start"
                        min={0}
                        value={this.state.currentMapping.start}
                        onChange={this.setStart}
                        onBlur={this.updateDefaultValue}
                        disabled={this.props.sourceLayout.length > 0}
                        hintText={"Start"}
                        errorText={this.state.errors.start ? " " : ''} // only mark the field as errored, don't show error message
                    />;
                </TableRowColumn>,
                <TableRowColumn key="end">
                    <TextField
                        type="number"
                        step={1}
                        min={0}
                        name="end"
                        value={this.state.currentMapping.end}
                        onChange={this.setEnd}
                        onBlur={this.updateDefaultValue}
                        disabled={this.props.sourceLayout.length > 0}
                        hintText={"End"}
                        errorText={this.state.errors.end ? " " : ''} // only mark the field as errored, don't show error message''}
                    />
                </TableRowColumn>]
            }
            {this.props.layoutType === 'delimited' &&
                <TableRowColumn key="position">
                    <TextField
                        type="number"
                        step={1}
                        min={0}
                        name="position"
                        value={this.state.currentMapping.position}
                        onChange={this.setPosition}
                        onBlur={this.updateDefaultValue}
                        disabled={this.props.sourceLayout.length > 0}
                        hintText={"Position"}
                    />;
                </TableRowColumn>
            }
        </TableRow>);
    }
}
