import * as React from 'react';
import { Card, CardActions, RaisedButton, FloatingActionButton, TextField } from 'material-ui';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

interface IWorkflowContentProps {
    content: string;
    editable: boolean;
    onUpdate: (string) => void;
}

interface IWorkflowContentState {
    editable: boolean;
    content: string;
}

const style: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '0 15px',
        marginTop: '79px'
    },
    card: {
        margin: 10,
        padding: 10
    },
    editButton: {
        position: 'absolute',
        right: '3%'
    },
    editableText: { overflowY: 'hidden' },
    editableContainer: { border: '1px solid', padding: '0 9px' },
};

export default class WorkflowContent extends React.Component<IWorkflowContentProps, IWorkflowContentState> {
    private textInput;
    constructor(props, context) {
        super(props, context);

        this.editContent = this.editContent.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSave = this.onSave.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.state = {
            editable: false,
            content: props.content || ''
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            content: nextProps.content
        });
    }
    private editContent() {
        this.setState({ editable: true });
    }
    private onSave() {
        const { content } = this.state;
        this.props.onUpdate(content);
    }
    private onCancel() {
        const { content } = this.props;
        this.setState({ content, editable: false });
    }
    private updateContent(event) {
        this.setState({ content: event.target.value });
    }
    private handleKeyDown(event) {
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            let { content } = this.state;
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;

            content = content.substring(0, start) + '\t' + content.substring(end);

            this.setState({ content });
        }
    }
    public render(): JSX.Element {
        return <div style={style.container}>
            <Card style={style.card}>
                <div>
                    {!this.state.editable && <FloatingActionButton style={style.editButton} onClick={this.editContent}>
                        <EditIcon />
                    </FloatingActionButton>}
                    {!this.state.editable && <pre>{this.state.content}</pre>}
                    {this.state.editable && <div>
                        <TextField
                            ref={(input) => { this.textInput = input; }}
                            multiLine={true}
                            fullWidth={true}
                            value={this.state.content}
                            name="content"
                            underlineShow={false}
                            onChange={this.updateContent}
                            textareaStyle={style.editableText}
                            style={style.editableContainer}
                            errorStyle={style.error}
                            onKeyDown={this.handleKeyDown}
                        />
                    </div>}
                </div>
                {this.state.editable && <CardActions style={{ textAlign: 'right' }}>
                    <RaisedButton label="Cancel" onClick={this.onCancel} />
                    <RaisedButton label="Save" onClick={this.onSave} primary={true} />
                </CardActions>}
            </Card>
        </div>;
    }
}
