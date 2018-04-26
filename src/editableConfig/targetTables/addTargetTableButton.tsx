import * as React from 'react';
import { RaisedButton } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';

import style from './targetTablesStyle';

const AddTargetTableButton = (props: { onClick: () => void }): JSX.Element => {
    return <RaisedButton
        label="Add Table"
        primary={true}
        onClick={props.onClick}
        icon={<AddIcon />}
        style={style.addButton}
    />;
};

export default AddTargetTableButton;
