import * as React from 'react';
import { capitalize, map } from 'lodash';
import { repeatableFilters } from '../../constants';

import { RaisedButton, Popover, Menu, MenuItem, PopoverAnimationVertical } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';

import ActionButtons from '../editableConfigActionButtons';

interface IEditConfigProps {
    onAdd: (string) => void;
}

interface IAddFilterState {
    open: boolean;
    anchorEl?: any;
}

const style: React.CSSProperties = {
    margin: '10px 0'
};

export default class AddFilter extends React.Component<IEditConfigProps, IAddFilterState> {
    constructor(props, context) {
        super(props, context);

        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.showOptions = this.showOptions.bind(this);

        this.state = { open: false, anchorEl: {} };
    }
    private handleRequestClose() {
        this.setState({ open: false });
    }
    private addFilter(filterName) {
        this.props.onAdd(filterName);
        this.setState({ open: false });
    }
    private showOptions(event) {
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }
    private format(filterName: string) {
        return capitalize(filterName.split('_').join(' '));
    }
    public render(): JSX.Element {
        return (<div>
            <RaisedButton
                primary={true}
                onClick={this.showOptions}
                label="Add Filter"
                icon={<AddIcon />}
                style={style}
            />
            <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={this.handleRequestClose}
                animation={PopoverAnimationVertical}
            >
                <Menu>
                    {map(repeatableFilters, (filter: string, index: number) => {
                        return <MenuItem key={index} value={filter} primaryText={this.format(filter)} onClick={() => this.addFilter(filter)} />;
                    })}
                </Menu>
            </Popover>
        </div>);
    }
}
