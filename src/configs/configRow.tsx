import * as React from 'react';
import style from './configsListStyle';
import { IConfig } from './config';

interface IConfigRowProps {
    config: IConfig;
    onEdit: (event) => void;
    onCopy: (event) => void;
}

import { TableRow, TableRowColumn, RaisedButton, IconButton } from 'material-ui';
import CopyContent from 'material-ui/svg-icons/content/content-copy';
import RunContent from 'material-ui/svg-icons/av/play-arrow';

const ConfigRow = (props: IConfigRowProps) => {
    return (
        <TableRow hoverable={true} selectable={false}>
            <TableRowColumn style={style.dataPartnerColumn}>{props.config.dataPartner} </TableRowColumn>
            <TableRowColumn> {props.config.feedType} </TableRowColumn>
            <TableRowColumn> {props.config.subType} </TableRowColumn>
            <TableRowColumn> {props.config.name} </TableRowColumn>
            <TableRowColumn>
                <div>
                    <RaisedButton id={props.config.path} label="Edit" primary={true} onClick={props.onEdit} style={style.actionButton} />
                    <IconButton id={props.config.path} tooltip="Copy As New" onClick={props.onCopy}>
                        <CopyContent />
                    </IconButton>
                </div>
            </TableRowColumn>
        </TableRow >
    );
};

export default ConfigRow;
