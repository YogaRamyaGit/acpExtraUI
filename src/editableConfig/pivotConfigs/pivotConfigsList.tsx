import * as React from 'react';
import * as _ from 'lodash';

import { IConfig } from '../../configs/config';
import PivotConfigRow from './pivotConfigRow';
import style from './pivotConfigStyle';

import { Card } from 'material-ui';

interface IPivotConfig {
    table_name?: string;
    field_mapping: any[];
}

interface IPivotConfigsProps {
    config: IConfig;
    pivotConfigs: IPivotConfig[];
    onChange: (tableName: string, updatedTable: string, mapping: any[]) => void;
    onRemove: (tableName: string) => void;
}

export default class PivotConfigsList extends React.Component<IPivotConfigsProps, null> {
    constructor(props, context) {
        super(props, context);

        this.getTableOptions = this.getTableOptions.bind(this);
        this.getTableColumns = this.getTableColumns.bind(this);
    }
    private getTableOptions(tableName): string[] {
        const mappedTables = _.map(this.props.pivotConfigs, 'table_name');
        const allTables = this.props.config.targetTables || [];

        return (_.concat(_.difference(allTables, mappedTables), tableName));
    }
    private getTableColumns(tableName: string): string[] {
        return this.props.config.getTableColumns(tableName);
    }
    public render(): JSX.Element {
        return (<div>
            {_.map(this.props.pivotConfigs, (config, index) => {
                return <Card key={index} containerStyle={style.configCard}>
                    <PivotConfigRow
                        {...config}
                        allMappedValues={this.props.config.mappedTargetColumns}
                        allTables={this.getTableOptions(config.table_name)}
                        tableColumns={this.getTableColumns(config.table_name)}
                        onChange={this.props.onChange}
                        onRemove={this.props.onRemove}
                    />
                </Card>;
            })}
        </div>);
    }

}
