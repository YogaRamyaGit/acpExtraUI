import * as React from 'react';
import * as _ from 'lodash';

import { IconButton, SelectField, MenuItem } from 'material-ui';
import Next from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import Previous from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

interface IPaginationProps {
    onChange: (rowsPerPage, pageNumber) => void;
    rowsPerPage?: number;
    currentPage?: number;
}

interface IPaginationState {
    rowsPerPage: number;
    currentPage: number;
}

const style: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex' as 'flex',
        justifyContent: 'flex-end' as 'flex-end'
    }
};

export default class Pagination extends React.Component<IPaginationProps, IPaginationState> {
    private rowsPerPageOptions: number[];
    constructor(props, context) {
        super(props, context);

        this.rowsPerPageOptions = [5, 10, 15, 20, 25];
        this.state = {
            rowsPerPage: props.rowsPerPage || 10,
            currentPage: props.currentPage || 1
        };

        this.onChangeRows = this.onChangeRows.bind(this);
    }
    private onChangeRows(event, index, value) {
        this.setState({ rowsPerPage: value });
        this.props.onChange(value, this.state.currentPage);
    }
    public render(): JSX.Element {
        return (<div style={style.container}>
            <IconButton tooltip="Previous Page" disabled={this.state.currentPage === 1}>
                <Previous />
            </IconButton>
            <SelectField
                hintText="Rows per page"
                value={this.state.rowsPerPage}
                onChange={this.onChangeRows}
            >
                {_.map(this.rowsPerPageOptions, (option: any) => {
                    return <MenuItem key={option} value={option} primaryText={option} />;
                })}
            </SelectField>
            <IconButton tooltip="Next Page">
                <Next />
            </IconButton>
        </div>);
    }
}
