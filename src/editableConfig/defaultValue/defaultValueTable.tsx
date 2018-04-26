import * as React from 'react';
import * as _ from 'lodash';

import DefaultValueRow from './defaultValueRow';

interface IDefaultValueTableProps {
    defaultValues: any;
    unMappedTargetColumns: any[];
    targetColumns: any[];
    mapping: any[];
    onChange: (targetColumn: string, mapping: any) => void;
}

export default class DefaultValueTable extends React.Component<IDefaultValueTableProps, null> {
    constructor(props, context) {
        super(props, context);

        this.getTargetColumns = this.getTargetColumns.bind(this);
    }
    private getTargetColumns(targetColumn) {
        // show options for all the un-ocupied target columns.
        // One target column can't can multiple default values.
        const mappedTargets = _.keys(this.props.defaultValues);
        // remove the current column from mapped list
        _.remove(mappedTargets, target => target === targetColumn);

        return _.filter(this.props.unMappedTargetColumns, column => {
            return !_.includes(mappedTargets, column.name);
        });
    }
    public render(): JSX.Element {
        return (<div>
            {_.map(this.props.defaultValues, (value: string, key: string) => {
                return (<DefaultValueRow
                    key={key}
                    targetColumn={key}
                    targetValue={value}
                    unMappedTargetColumns={this.getTargetColumns(key)}
                    allTargetColumns={this.props.targetColumns}
                    allMappings={this.props.mapping}
                    onChange={this.props.onChange}
                />);
            })}
        </div>);
    }
}
