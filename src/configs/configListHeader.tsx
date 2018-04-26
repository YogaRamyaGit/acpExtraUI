import * as React from 'react';
import style from './configsListStyle';
interface IHeader {
    title: string;
    sortable?: boolean;
    id?: string;
}
interface IConfigListHeaderProps {
    header: IHeader;
    sortDirection?: string;
    onFlip: (event) => void;
}

import { TableHeaderColumn, IconButton } from 'material-ui';
import UpArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';

const ConfigListHeader = (props: IConfigListHeaderProps) => {
    const headerStyle: React.CSSProperties = props.sortDirection ? style.sortableHeader : {};
    return (<TableHeaderColumn style={style.headerText} >
        <span style={headerStyle} >
            <span id={props.header.title} onClick={() => props.onFlip(props.header.id)}>{props.header.title} </span>
            {props.sortDirection && <IconButton id={props.header.title} onClick={() => props.onFlip(props.header.id)} style={style.sortButton} >
                {(props.sortDirection === 'asc') ? <UpArrow color='#fff' /> : <DownArrow color='#fff' />}
            </IconButton>}
        </span>
    </TableHeaderColumn >);
};

export default ConfigListHeader;
