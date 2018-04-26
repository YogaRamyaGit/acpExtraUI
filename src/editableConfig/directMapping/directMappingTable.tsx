import * as React from 'react';
import * as _ from 'lodash';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    TableHeader,
    TableHeaderColumn,
    RadioButton,
    RadioButtonGroup
} from 'material-ui';

import { specialColumnTypes } from '../../targetColumnTypes/alteredColumns';
import helper from '../../helper';
import DirectMappingRow from './directMappingRow';
import style from './directMappingStyle';

interface ITargetColumn {
    name: string;
    type: string;
    notNull: boolean;
    defaultValue?: string;
    pk: boolean;
}

interface IDirectMappingTableProps {
    targetColumns: ITargetColumn[];
    layoutType: string;
    sourceLayout: any[];
    mapping: any[];
    onChange: (target: string, source: any, defaultValue: string) => void;
}

interface IDirectMappingTableState {
    listStatus: string;
}

export default class DirectMappingTable extends React.Component<IDirectMappingTableProps, IDirectMappingTableState> {
    constructor(props, context) {
        super(props, context);

        this.changeListStatus = this.changeListStatus.bind(this);
        this.getCurrentColumns = this.getCurrentColumns.bind(this);
        this.getMapping = this.getMapping.bind(this);

        this.state = {
            listStatus: 'both'
        };
    }
    private changeListStatus(event: any, listStatus: string) {
        this.setState({ listStatus });
    }
    private getCurrentColumns(): any[] {
        const { listStatus } = this.state;
        const mappedFields = this.props.mapping;
        let currentColumns = [];

        switch (listStatus) {
            case 'both':
                const allColumns = _.assign([], this.props.targetColumns);
                _.forEach(mappedFields, field => {
                    // For local variables
                    if (!_.find(allColumns, { name: field.name })) {
                        allColumns.push({
                            name: field.name,
                            type: 'string',
                            notNull: false
                        });
                    }
                });
                currentColumns = allColumns;
                break;
            case 'mapped':
                currentColumns = _.reduce(mappedFields, (result, field) => {
                    const mappedTarget = _.find(this.props.targetColumns, { name: field.name });

                    if (mappedTarget) {
                        result.push(mappedTarget);
                    } else {
                        // for local variables
                        result.push({
                            name: field.name,
                            type: 'string',
                            notNull: false
                        });
                    }
                    return result;
                }, []);
                break;
            case 'unmapped':
                currentColumns = _.filter(this.props.targetColumns, (column) => !_.find(mappedFields, { name: column.name }));
                break;
            case 'required':
                currentColumns = _.filter(this.props.targetColumns, { notNull: true });
                break;

            default:
                currentColumns = this.props.targetColumns;
        }

        return _.sortBy(currentColumns, 'name');
    }
    private getMapping(column): any {
        return _.find(this.props.mapping, { name: column }) || {};
    }
    private getSourceColumns(columnInfo: any = {}) {
        if (_.includes(specialColumnTypes, columnInfo.type)) {
            return _.filter(this.props.sourceLayout, source => helper.compare(source.type, columnInfo.type));
        } else {
            return this.props.sourceLayout;
        }
    }
    public render(): JSX.Element {
        return (
            <div>
                <RadioButtonGroup onChange={this.changeListStatus} labelPosition="right" name="listStatus" valueSelected={this.state.listStatus} style={style.radioButtonGroup}>
                    <RadioButton
                        value="mapped"
                        label="Show Mapped"
                        style={style.radioButton}
                    />
                    <RadioButton
                        value="unmapped"
                        label="Show Unmapped"
                        style={style.radioButton}
                    />
                    <RadioButton
                        value="both"
                        label="Show Both"
                        style={style.radioButton}
                    />
                    <RadioButton
                        value="required"
                        label="Show Required"
                        style={style.radioButton}
                    />
                </RadioButtonGroup>
                <Table selectable={false} wrapperStyle={style.table}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={style.tableHeader}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn key={'target'} style={style.headerText}>{'Target Column'}</TableHeaderColumn>
                            <TableHeaderColumn key={'source'} style={style.headerText}>{'Source Column'}</TableHeaderColumn>
                            <TableHeaderColumn key={'default'} style={style.headerText}>{'Default'}</TableHeaderColumn>
                            {this.props.layoutType === 'fixedWidth' &&
                                [<TableHeaderColumn key={'start'} style={style.headerText}>{'Start'}</TableHeaderColumn>,
                                <TableHeaderColumn key={'end'} style={style.headerText}>{'End'}</TableHeaderColumn>]
                            }
                            {this.props.layoutType === 'delimited' &&
                                <TableHeaderColumn key={'position'} style={style.headerText}>{'Position'}</TableHeaderColumn>
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {_.map(this.getCurrentColumns(), (column, index) => {
                            return <DirectMappingRow
                                key={`${column.name}-${index}`}
                                layoutType={this.props.layoutType}
                                targetColumn={column}
                                sourceLayout={this.getSourceColumns(column)}
                                mapping={this.getMapping(column.name)}
                                onChange={this.props.onChange}
                            />;
                        })}
                    </TableBody>
                </Table>
            </div>);
    }
}
