import * as React from 'react';
import { Card } from 'material-ui';
import { flatten, includes } from 'lodash';

import { specialColumnTypes, dateColumnTypes, decimalColumnTypes } from '../../targetColumnTypes/alteredColumns';
import ConcatenationRow from './concatenation/concatenationRow';
import DateTransformRow from './dateTransform/dateTransformRow';
import Overpunch from './overpunch/overpunch';

interface IMultiparamSectioProps {
    sections: any[];
    allTargetColumns: any[];
    allUnmappedTargetColumns: any[];
    allMappedValues: string[];
    onUpdate: (section, index) => void;
    onRemove: (index) => void;
}

export default class MultiparamSections extends React.Component<IMultiparamSectioProps, null>{
    constructor(props, context) {
        super(props, context);

        this.updateConcatenation = this.updateConcatenation.bind(this);
        this.updateDateTransform = this.updateDateTransform.bind(this);
        this.updateOverpunch = this.updateOverpunch.bind(this);
        this.removeSection = this.removeSection.bind(this);
        this.getSectionContent = this.getSectionContent.bind(this);
    }
    private updateOverpunch(index: number, params: any) {
        const section = {
            method: 'convert_overpunch_to_decimal_format',
            params
        };
        this.props.onUpdate(section, index);
    }
    private updateDateTransform(index: number, params: any) {
        const section = {
            method: 'get_validated_date',
            params
        };
        this.props.onUpdate(section, index);
    }
    private updateConcatenation(index: number, updatedTargetField: string, fields: string[], delimiter: string) {
        const section = {
            method: 'get_concatenated_field',
            params: {
                fields,
                delimiter,
                target_field: updatedTargetField
            }
        };

        this.props.onUpdate(section, index);
    }
    private removeSection(index: number) {
        this.props.onRemove(index);
    }
    private getTargetColumns(method: string, fieldName: string, index: number = NaN) {
        let allMappedSections = this.props.sections.filter(section => section.method === method);

        let alreadyMappedColumns = [];
        switch (method) {
            case 'get_concatenated_field':
                alreadyMappedColumns = allMappedSections.map(section => section.params.target_field);
                return this.props.allUnmappedTargetColumns.reduce((result, column) => {
                    // only string columns
                    const isTypeString = !includes(specialColumnTypes, (column.type || '').toLowerCase());
                    const validOption = (alreadyMappedColumns.indexOf(column.name) < 0) || (column.name === fieldName);

                    if (isTypeString && validOption) {
                        result.push(column);
                    }
                    return result;
                }, []);

            case 'get_validated_date':
                alreadyMappedColumns = allMappedSections.map(section => section.params.targetfieldname);
                return this.props.allTargetColumns.reduce((result: any[], column: any) => {
                    // only date columns
                    const isTypeDate = (dateColumnTypes.indexOf(column.type.toLowerCase()) >= 0);
                    const validOption = (alreadyMappedColumns.indexOf(column.name) < 0) || (column.name === fieldName);

                    if (isTypeDate && validOption) {
                        result.push(column);
                    }
                    return result;
                }, []);

            case 'convert_overpunch_to_decimal_format':
                allMappedSections = this.props.sections.filter((section: any, i: number) => {
                    return section.method === method && i !== index;
                });
                alreadyMappedColumns = flatten(allMappedSections.map(section => section.params.targetfieldname));
                return this.props.allTargetColumns.filter(column => {
                    const isTypeDecimal = (decimalColumnTypes.indexOf(column.type.toLowerCase()) >= 0);
                    const validOption = alreadyMappedColumns.indexOf(column.name) < 0;

                    return isTypeDecimal && validOption;
                });

            default:
                return this.props.allTargetColumns;
        }
    }
    private getSectionContent(section, index): JSX.Element {
        switch (section.method) {
            case 'get_concatenated_field':
                return <ConcatenationRow
                    {...section.params}
                    allTargetColumns={this.getTargetColumns('get_concatenated_field', section.params.target_field)}
                    allMappings={this.props.allMappedValues}
                    onChange={this.updateConcatenation}
                    onRemove={this.removeSection}
                    index={index}
                />;

            case 'get_validated_date':
                return <DateTransformRow
                    {...section.params}
                    targetColumns={this.getTargetColumns('get_validated_date', section.params.targetfieldname)}
                    onChange={this.updateDateTransform}
                    onRemove={this.removeSection}
                    index={index}
                />;

            case 'convert_overpunch_to_decimal_format':
                return <Overpunch
                    {...section.params}
                    targetColumns={this.getTargetColumns('convert_overpunch_to_decimal_format', '', index)}
                    onChange={this.updateOverpunch}
                    onRemove={this.removeSection}
                    index={index}
                />;

            default:
                return <div>TO BE CREATED: {index}</div>;
        }

    }
    public render() {
        return (<div>
            {this.props.sections.map((section: any, index: number) => {
                return <Card key={index}>
                    {this.getSectionContent(section, index)}
                </Card>;
            })}
        </div>);
    }
}
