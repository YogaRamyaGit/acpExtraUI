import * as React from 'react';
import { RaisedButton, IconButton, Popover, PopoverAnimationVertical, TextField, Chip } from 'material-ui';
import InfoIcon from 'material-ui/svg-icons/action/info';

import PRRow from './prRow';

interface IPRInfoProps {
    title?: string;
    openPR?: any;
    mergedPR?: any;
}

interface IPRInfoState {
    open: boolean;
    anchorEl: any;
}

const style: {[key: string]: React.CSSProperties} = {
    popover: { padding: 5 }
};

export default class PRInfo extends React.Component<IPRInfoProps, IPRInfoState> {
    constructor(props, context) {
        super(props, context);

        this.state = { open: false, anchorEl: {} };

        this.handleClick = this.handleClick.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }
    private handleClick(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }
    private handleRequestClose() {
        this.setState({
            open: false,
            anchorEl: {}
        });
    }
    public render(): JSX.Element {
        return (<div>
            <RaisedButton
                primary={true}
                onClick={this.handleClick}
                label={this.props.title || "PR LINK"}
                icon={<InfoIcon />}
            />
            <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={this.handleRequestClose}
                animation={PopoverAnimationVertical}
                style={style.popover}
            >
                <div>
                    {this.props.openPR && <PRRow pr={this.props.openPR} />}
                    {this.props.mergedPR && <PRRow pr={this.props.mergedPR} />}
                </div>
            </Popover>
        </div>);
    }
}
