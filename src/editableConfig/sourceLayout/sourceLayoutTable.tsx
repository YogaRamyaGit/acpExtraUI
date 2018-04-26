import * as React from 'react';
import * as _ from 'lodash';

import style from './sourceLayoutStyle';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    Checkbox
} from 'material-ui';

interface ISourceLayoutTableProps {
    sourceLayout: any[];
}

const SourceLayoutTable = (props: ISourceLayoutTableProps) => {
    const headers = _.uniq(_.concat(_.keys(props.sourceLayout[0]), ['type', 'format', 'de-id']));
    return (<div>
        <Table fixedHeader={true} selectable={false} >
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={style.tableHeader}>
                <TableRow selectable={false}>
                    {_.map(headers, header => {
                        return <TableHeaderColumn key={header} style={style.headerText}>{header}</TableHeaderColumn>;
                    })}
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {_.map(props.sourceLayout, (row: string[], index: number) => {
                    return (<TableRow key={index}>
                        {_.map(headers, (header, i) => {
                            if (header === 'de-id') {
                                return <TableRowColumn key={i}><Checkbox /></TableRowColumn>;
                            } else {
                                return <TableRowColumn key={i}>{row[header]}</TableRowColumn>;
                            }
                        })}
                    </TableRow>);
                })}
            </TableBody>
        </Table>
    </div>);
};

export default SourceLayoutTable;
