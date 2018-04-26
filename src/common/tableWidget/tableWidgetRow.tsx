import * as React from 'react';
import { map } from 'lodash';

import {
    TableRow,
    TableRowColumn,
    RaisedButton
} from 'material-ui';

interface ITableWidgetRowProps {
    row: any;
    headers: any[];
    actions: any[];
}

const TableWidgetRow = (props: ITableWidgetRowProps): JSX.Element => {
    return <TableRow>
        {map(props.headers, (header, index) => {
            return <TableRowColumn>{props.row[header.value]}</TableRowColumn>;
        })}
        {props.actions.length > 0 && <TableRowColumn>
            {map(props.actions, (action, index) => {
                return <RaisedButton
                    label={action.title}
                    onClick={() => action.onClick(props.row)}
                    primary={true}
                />;
            })}
        </TableRowColumn>}
    </TableRow>;
};

export default TableWidgetRow;
