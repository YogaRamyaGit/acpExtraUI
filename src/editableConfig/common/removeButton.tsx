import * as React from 'react';

import { RaisedButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

const style: {[key: string]: React.CSSProperties} = {
    container: { textAlign: 'right' },
    button: { margin: '10px 0' }
};

interface IRemoveButtonProps {
    onClick: () => void;
}
const RemoveButton = (props: IRemoveButtonProps) => {
    return <RaisedButton
        onClick={props.onClick}
        label="Remove Filter"
        primary={true}
        style={style.button}
    />;
};

export default RemoveButton;
