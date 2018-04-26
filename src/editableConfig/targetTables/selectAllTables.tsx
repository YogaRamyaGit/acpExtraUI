import * as React from 'react';
import * as _ from 'lodash';

import { Checkbox } from 'material-ui';

interface ISelectAllProps {
    checked: boolean;
    onChange: (event: any, selectAll: boolean) => void;
}

const SelectAllTables = (props: ISelectAllProps) => {
    return (<Checkbox
        label={props.checked ? 'Remove All' : 'Select All'}
        checked={props.checked}
        onCheck={props.onChange}
    />);
};

export default SelectAllTables;
