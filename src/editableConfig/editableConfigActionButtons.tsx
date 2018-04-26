import * as React from 'react';
import style from './editableConfigStyle';

import { RaisedButton } from 'material-ui';

interface IActionButtonProps {
    onSave: (any) => void;
}

const ActionButtons = (props: IActionButtonProps) => {
    return (<div style={style.submitButtons}>
        <RaisedButton
            label="Save"
            primary={true}
            onClick={props.onSave}
        />
    </div>);
};

export default ActionButtons;
