import * as React from 'react';
import {assign} from 'lodash';
import {Card, CardHeader, CardText, CardAction, Dialog, IconButton, FlatButton, Subheader} from 'material-ui';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-less';
import ContractIcon from 'material-ui/svg-icons/navigation/expand-more';

interface ILogsProps {
    logs: any;
    open?: boolean;
    style?: React.CSSProperties;
}
interface ILogsState {
    open: boolean;
}
const style: {[key: string]: React.CSSProperties} = {
    card: {
        margin: '10px 15px',
        padding: 10
    },
    container: {
        transition: 'height 0.5s ease-in-out'
    },
    dialog: {
        width: '100%',
        maxWidth: 'none',
        position: 'fixed' as 'fixed',
        bottom: '7vh'
    },
    expandButton: {
        position: 'fixed' as  'fixed',
        bottom: 0,
        left: '50%'
    }
};
export default class Logs extends React.Component<ILogsProps, ILogsState> {
    constructor(props, context){
        super(props, context);

        this.toggleCard = this.toggleCard.bind(this);

        this.state = {open: this.props.open === undefined ? true : this.props.open};
    }
    private toggleCard(){
        this.setState({open: !this.state.open});
    }
    public render(): JSX.Element {
        return <div>
            <Dialog title="Logs" modal={false} open={this.state.open} onRequestClose={this.toggleCard} contentStyle={style.dialog} autoScrollBodyContent={true} repositionOnUpdate={false}>           
                <div>
                    {Object.keys(this.props.logs).map((key: string, index: number) => {
                        return <div key={index}>
                            <Subheader>{key}</Subheader>
                            <pre>{this.props.logs[key]}</pre>
                        </div>;
                    })}
                </div>        
            </Dialog>
            {!this.state.open && <FlatButton
                label="Show Logs"
                labelPosition="before"
                primary={true}
                onClick={this.toggleCard}
                style={style.expandButton}
                icon={<ExpandIcon />}
            />}
        </div>;
    }
}