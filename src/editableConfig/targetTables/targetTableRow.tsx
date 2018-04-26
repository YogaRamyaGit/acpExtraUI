import * as React from 'react';
import * as _ from 'lodash';

import { Checkbox } from 'material-ui';
import style from './targetTablesStyle';

interface ITargetTableRowProps {
    tableName: string;
    checked: boolean;
    onChange: (tableName: string) => void;
}

export default class TargetTableRow extends React.Component<ITargetTableRowProps, null> {
    constructor(props, context) {
        super(props, context);

        this.toggleTable = this.toggleTable.bind(this);
    }
    private toggleTable(event, isInputChecked) {
        this.props.onChange(this.props.tableName);
    }
    public render(): JSX.Element {
        return (<Checkbox
            label={this.props.tableName}
            checked={this.props.checked}
            onCheck={this.toggleTable}
            style={style.row}
        />);
    }

}
