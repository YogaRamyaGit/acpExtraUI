import * as React from 'react';
import * as _ from 'lodash';

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableRowColumn,
    IconButton,
    RaisedButton
} from 'material-ui';

import { IConfig } from './config';
import style from './configsListStyle';
import ConfigListHeader from './configListHeader';
import ConfigRow from './configRow';

interface IConfigListProps {
    configs: IConfig[];
    onEdit: (IConfig) => void;
    onCopy: (IConfig) => void;
}
interface IConfigListState {
    sortOrder: any;
}
interface IHeader {
    title: string;
    sortable?: boolean;
    id?: string;
}
export default class ConfigsList extends React.Component<IConfigListProps, IConfigListState> {
    private headers: IHeader[];
    constructor(props, context) {
        super(props, context);

        this.headers = [
            {
                title: 'Data Partner',
                id: 'data_partner_name'
            },
            {
                title: 'Feed Type',
                id: 'feed_name'
            },
            {
                title: 'Sub Type',
                id: 'sub_type'
            },
            {
                title: 'File Name',
                id: 'name'
            },
            {
                title: 'Actions'
            }
        ];

        this.state = {
            sortOrder: {
            }
        };

        this.flipSortOrder = this.flipSortOrder.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onCopy = this.onCopy.bind(this);
    }
    public flipSortOrder(headerId) {
        const { sortOrder } = this.state;

        if (sortOrder[headerId]) {
            sortOrder[headerId] = (sortOrder[headerId] === 'asc' ? 'desc' : 'asc');
        }

        this.setState({ sortOrder });
    }
    private onEdit(event) {
        const path = event.currentTarget.id;
        // find config by path
        const config = _.find(this.props.configs, { path });
        if (config) {
            this.props.onEdit(config);
        }
    }
    private onCopy(event) {
        const path = event.currentTarget.id;
        // find config by path
        const config = _.find(this.props.configs, { path });
        if (config) {
            this.props.onCopy(config);
        }
    }
    public render(): JSX.Element {
        return (<Table fixedHeader={true} selectable={false} >
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={style.header}>
                <TableRow selectable={false}>
                    {_.map(this.headers, header => {
                        return <ConfigListHeader key={header.title} header={header} onFlip={this.flipSortOrder} sortDirection={this.state.sortOrder[header.id]} />;
                    })}
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {_.map(this.props.configs, (config, index) => {
                    return <ConfigRow key={index} config={config} onEdit={this.onEdit} onCopy={this.onCopy} />;
                })}
            </TableBody>
        </Table>);
    }
}
