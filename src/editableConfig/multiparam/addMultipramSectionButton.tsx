import * as React from 'react';
import { AddButton } from '../common';

import { RaisedButton, Popover, Menu, MenuItem, PopoverAnimationVertical } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import style from './multiParamStyle';

interface IAddMultiparamProps {
    onAdd: (sectionName) => void;
}

interface IAddMultiparamState {
    open: boolean;
    anchorEl: any;
}

export default class AddMultiparamSectionButton extends React.Component<IAddMultiparamProps, IAddMultiparamState>{
    private sections = [
        { title: 'Concatenation', value: 'get_concatenated_field' },
        { title: 'Date Transform', value: 'get_validated_date' },
        { title: 'Overpunch', value: 'convert_overpunch_to_decimal_format' }
    ];
    constructor(props, context) {
        super(props, context);

        this.showMenu = this.showMenu.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.addSection = this.addSection.bind(this);

        this.state = { open: false, anchorEl: {} };
    }

    private showMenu(event) {
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }

    private handleRequestClose() {
        this.setState({ open: false });
    }

    private addSection(sectionName) {
        this.props.onAdd(sectionName);
    }

    public render(): JSX.Element {
        return (<div>
            <RaisedButton
                primary={true}
                onClick={this.showMenu}
                label="Add Section"
                icon={<AddIcon />}
                style={style.addButton}
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
                    {this.sections.map((section: any, index: number) => {
                        return <MenuItem key={index} value={section.value} primaryText={section.title} onClick={() => this.addSection(section.value)} />;
                    })}
                </Menu>
            </Popover>
        </div>);
    }
}
