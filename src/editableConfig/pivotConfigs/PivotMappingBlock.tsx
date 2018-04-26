import * as React from 'react';
import * as _ from 'lodash';

import { IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import PivotMappingRow from './pivotMappingRow';
import style from './pivotConfigStyle';
import { AddButton } from '../common';

interface IPivotMappingBlockProps {
    mapping: any;
    index: number;
    allColumns: any[];
    allMappedValues: any[];
    onChange: (index: number, mapping: any) => void;
    onRemove: (index: number) => void;
}

interface IPivotMappingBlockState {
    mapping: any;
}

export default class PivotMappingBlock extends React.Component<IPivotMappingBlockProps, IPivotMappingBlockState> {
    constructor(props, context) {
        super(props, context);

        this.updateMapping = this.updateMapping.bind(this);
        this.removeMapping = this.removeMapping.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.showNewForm = this.showNewForm.bind(this);
        this.removeBlock = this.removeBlock.bind(this);

        this.state = {
            mapping: this.props.mapping
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({ mapping: nextProps.mapping });
    }
    private removeMapping(columnName: string) {
        const { mapping } = this.state;

        if (_.includes(_.keys(mapping), columnName)) {
            delete mapping[columnName];
        }

        this.setState({ mapping });
        this.props.onChange(this.props.index, mapping);
    }
    private updateMapping(columnName: string, updatedColumnName: string, value: string) {
        let { mapping } = this.state;
        const currentKeys = _.keys(mapping);
        const currentIndex = _.indexOf(currentKeys, columnName);

        // format the record to process as an array
        const formattedValues = _.map(mapping, (val: string, k: string) => {
            return { key: k, value: val };
        });

        if (currentIndex >= 0) {
            // update the record;
            formattedValues[currentIndex] = { key: updatedColumnName, value };
            // re-construct default values
            mapping = _.reduce(formattedValues, (result, val: any) => {
                result[val.key] = val.value;
                return result;
            }, {});
        } else {
            mapping[updatedColumnName] = value;
        }
        this.setState({ mapping });

        this.props.onChange(this.props.index, mapping);
    }
    private getColumns(columnName): any[] {
        const mappedColumns = _.keys(this.state.mapping);
        const allColumns = this.props.allColumns;

        return _.filter(allColumns, column => {
            const mappedColumn = _.includes(mappedColumns, column.name);

            return !mappedColumn || (column.name === columnName);
        });
    }
    private removeBlock() {
        this.props.onRemove(this.props.index);
    }
    private showNewForm() {
        const { mapping } = this.state;

        if (!_.includes(_.keys(mapping), '')) {
            mapping[''] = '';
        }

        this.setState({ mapping });
    }
    public render(): JSX.Element {
        return (<div>
            <div style={style.mappingRowsContainer}>
                <div style={style.iconWrapper}>
                    <IconButton onClick={this.removeBlock} style={style.deleteIcon}>
                        <ClearIcon />
                    </IconButton>
                </div>

                <div style={style.rowsContainer}>
                    {_.map(this.state.mapping, (value: string, columnName: string) => {
                        return <PivotMappingRow
                            key={columnName}
                            columnName={columnName}
                            value={value}
                            allColumns={this.getColumns(columnName)}
                            allMappedValues={this.props.allMappedValues}
                            onChange={this.updateMapping}
                            onRemove={this.removeMapping}
                        />;
                    })}
                </div>

                <div style={style.addMappingRowButton}>
                    <AddButton label={"Add Row"} onClick={this.showNewForm} />
                </div>
            </div>
        </div>);
    }
}
