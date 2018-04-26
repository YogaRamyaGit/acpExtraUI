import * as React from 'react';
import { RaisedButton } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';

const style: React.CSSProperties = {
    margin: '10px 0'
};

interface IAddButtonProps {
    label?: string;
    onClick: () => void;
}

const AddButton = (props: IAddButtonProps): JSX.Element => {
    return <RaisedButton
        label={props.label || "Add Column"}
        primary={true}
        onClick={props.onClick}
        icon={<AddIcon />}
        style={style}
    />;
};

export default AddButton;
