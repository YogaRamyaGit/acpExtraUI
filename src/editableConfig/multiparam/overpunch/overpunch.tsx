import * as React from 'react';

import { Card, IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import style from './overpunchStyle';
import OverpunchRow from './overpunchRow';
import { AddButton } from '../../common';

interface IOverpunchProps {
    sourcefieldname: string[];
    targetfieldname: string[];
    decimalplaces: number[];
    targetColumns: any[];
    onChange: (index: number, params: any) => void;
    onRemove: (index: number) => void;
    index: number;
}

interface IOverpunchRow {
    sourceField: string;
    targetField: string;
    decimalPlaces: number;
}

interface IOverpunchState {
    overpunchFields: IOverpunchRow[];
}

export default class Overpunch extends React.Component<IOverpunchProps, IOverpunchState> {
    constructor(props, context) {
        super(props, context);

        this.getTargetColumns = this.getTargetColumns.bind(this);
        this.updateRow = this.updateRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.showNewForm = this.showNewForm.bind(this);

        const overpunchFields = (this.props.sourcefieldname || ['']).reduce((result, field, index) => {
            result.push({
                sourceField: field,
                targetField: (this.props.targetfieldname || [])[index] || '',
                decimalPlaces: (this.props.decimalplaces || [])[index] || ''
            });
            return result;
        }, []);

        this.state = {
            overpunchFields
        };
    }
    public componentWillReceiveProps(nextProps) {
        const overpunchFields = (nextProps.sourcefieldname || ['']).reduce((result, field, index) => {
            result.push({
                sourceField: field,
                targetField: (nextProps.targetfieldname || [])[index] || '',
                decimalPlaces: (nextProps.decimalplaces || [])[index] || ''
            });
            return result;
        }, []);

        this.setState({
            overpunchFields
        });
    }
    private getTargetColumns(fieldName: string) {
        const allMappedColumns = this.props.targetfieldname || [];

        return this.props.targetColumns.filter(column => {
            return allMappedColumns.indexOf(column.name) < 0 || column.name === fieldName;
        });
    }
    private updateConfig(overpunchFields) {
        // format fields
        const formattedFields = overpunchFields.reduce((result, field) => {
            result.sourcefieldname = result.sourcefieldname || [];
            result.targetfieldname = result.targetfieldname || [];
            result.decimalplaces = result.decimalplaces || [];

            result.sourcefieldname.push(field.sourceField);
            result.targetfieldname.push(field.targetField);
            result.decimalplaces.push(field.decimalPlaces ? parseInt(field.decimalPlaces, 10) : 0);

            return result;
        }, {});

        this.props.onChange(this.props.index, formattedFields);
    }
    private updateRow(index: number, row: any) {
        const { overpunchFields } = this.state;

        overpunchFields[index] = row;
        this.setState({ overpunchFields });

        this.updateConfig(overpunchFields);
    }
    private removeRow(index: number) {
        const { overpunchFields } = this.state;

        overpunchFields.splice(index, 1);

        this.setState({ overpunchFields });
        this.updateConfig(overpunchFields);
    }
    private removeFilter() {
        this.props.onRemove(this.props.index);
    }
    private showNewForm() {
        const { overpunchFields } = this.state;

        if (overpunchFields.find(field => field.targetField === '')) {
            return;
        }

        overpunchFields.push({
            sourceField: '',
            targetField: '',
            decimalPlaces: 0
        });

        this.setState({ overpunchFields });
    }
    public render(): JSX.Element {
        return <Card containerStyle={style.configCard}>
            <div style={style.iconContainer}>
                <IconButton tooltip="Remove" onClick={this.removeFilter} style={style.removeIcon} >
                    <ClearIcon />
                </IconButton>
            </div>
            <div>
                {this.state.overpunchFields.map((field: IOverpunchRow, index: number) => {
                    return <OverpunchRow
                        key={index}
                        {...field}
                        index={index}
                        targetColumns={this.getTargetColumns(field.targetField)}
                        onChange={this.updateRow}
                        onRemove={this.removeRow}
                    />;
                })}
            </div>
            <AddButton
                label="Add Row"
                onClick={this.showNewForm}
            />
        </Card>;
    }
}
