import * as React from 'react';
import { map } from 'lodash';

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn
} from 'material-ui';

import TableWidgetRow from './tableWidgetRow';
import style from './tableWidgetStyle';

export interface IHeader {
    title: string;
    value: string;
}

export interface IAction {
    title: string;
    onClick: (any) => void;
}

interface ITableWidgetProps {
    headers: IHeader[];
    rows: any[];
    actions: IAction[];
}
const TableWidget = (props: ITableWidgetProps): JSX.Element => {
    return <Table fixedHeader={true} selectable={false} >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={style.header}>
            <TableRow selectable={false}>
                {map(props.headers, (header: IHeader) => {
                    return <TableHeaderColumn style={style.headerText} >
                        <span id={header.title}>{header.title} </span>
                    </ TableHeaderColumn>;
                })}
                {props.actions.length > 0 && <TableHeaderColumn style={style.headerText} >
                    <span id={'actions'}>{'Action'} </span>
                </ TableHeaderColumn>}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {map(props.rows, (row, index) => {
                return <TableWidgetRow key={index} headers={props.headers} row={row} actions={props.actions} />;
            })}
        </TableBody>
    </Table>;
};

export default TableWidget;
