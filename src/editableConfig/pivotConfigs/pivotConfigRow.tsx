import * as React from 'react';
import * as _ from 'lodash';

import { SelectField, MenuItem, AutoComplete, RaisedButton, IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import PivotMappingsBlock from './PivotMappingBlock';
import style from './pivotConfigStyle';
import { AddButton } from '../common';

interface IPivotConfigRowProps {
    table_name?: string;
    allTables: string[];
    tableColumns: any[];
    field_mapping: any[];
    allMappedValues: any[];
    onChange: (tableName: string, updatedTable: string, mapping: any[]) => void;
    onRemove: (tableName: string) => void;
}

interface IPivotConfigRowState {
    tableName: string;
    mappings: any[];
}

export default class PivotConfigRow extends React.Component<IPivotConfigRowProps, IPivotConfigRowState> {
    constructor(props, context) {
        super(props, context);

        this.chooseTableName = this.chooseTableName.bind(this);
        this.updateMapping = this.updateMapping.bind(this);
        this.addBlock = this.addBlock.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.removeBlock = this.removeBlock.bind(this);

        this.state = {
            tableName: this.props.table_name,
            mappings: this.props.field_mapping
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            tableName: nextProps.table_name,
            mappings: nextProps.field_mapping
        });
    }
    private chooseTableName(event, index, tableName) {
        this.setState({ tableName });

        this.props.onChange(this.props.table_name, tableName, this.state.mappings);
    }
    private updateMapping(index: number, mapping: any) {
        const { mappings } = this.state;

        mappings[index] = mapping;
        this.setState({ mappings });
        this.props.onChange(this.props.table_name, this.state.tableName, mappings);
    }
    private onRemove() {
        this.props.onRemove(this.props.table_name);
    }
    private removeBlock(index) {
        const { mappings } = this.state;

        if (index >= 0) {
            mappings.splice(index, 1);
        }

        this.setState({ mappings });
        this.props.onChange(this.props.table_name, this.state.tableName, mappings);
    }
    public addBlock() {
        const { mappings } = this.state;

        mappings.push({ '': '' });

        this.setState({ mappings });
    }
    public render(): JSX.Element {
        return <div className="row">
            <div style={style.iconWrapper}>
                <IconButton onClick={this.onRemove} style={style.deleteIcon}>
                    <ClearIcon />
                </IconButton>
            </div>
            <div className="col-md-3">
                <SelectField
                    floatingLabelText="Table Name"
                    floatingLabelFixed={true}
                    value={this.state.tableName}
                    onChange={this.chooseTableName}
                    fullWidth={true}
                >
                    {_.map(this.props.allTables, (table, index) => {
                        return <MenuItem key={index} value={table} primaryText={table} />;
                    })}
                </SelectField>
            </div>

            <div className="col-md-12">
                {_.map(this.state.mappings, (mapping, index) => {
                    return <PivotMappingsBlock
                        key={index}
                        index={index}
                        mapping={mapping}
                        allColumns={this.props.tableColumns}
                        allMappedValues={this.props.allMappedValues}
                        onChange={this.updateMapping}
                        onRemove={this.removeBlock}
                    />;
                })}
            </div>

            <div className="col-md-12">
                <AddButton label={'Add Pivot Section'} onClick={this.addBlock} />
            </div>
        </div>;
    }
}
