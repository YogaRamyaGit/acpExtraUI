import * as React from 'react';
import { assign } from 'lodash';
import helper from '../../helper';
import { FlatButton, FloatingActionButton, Dialog, TextField } from 'material-ui';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

interface IFileContentProps {
    isOpen: boolean;
    title?: string;
    content: any;
    onClose: () => void;
    onUpdate: (content: any) => void;
}

interface IFileContentState {
    editable: boolean;
    content: any;
    error: any;
}

const style: {[key: string]: React.CSSProperties} = {
    editButton: {
        position: 'absolute',
        right: '6%'
    },
    editableText: { overflowY: 'hidden' },
    editableContainer: { border: '1px solid', padding: '0 9px' },
    error: { bottom: 0, marginTop: 5 },
};

const colors: any = {
    errorColor: 'red',
    successColor: '#ccc'
};

export default class FileContent extends React.Component<IFileContentProps, IFileContentState> {
    private textInput;
    constructor(props, context) {
        super(props, context);

        this.onCancel = this.onCancel.bind(this);
        this.editContent = this.editContent.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.onSave = this.onSave.bind(this);
        this.getBorderStyle = this.getBorderStyle.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.state = {
            editable: false,
            content: JSON.stringify(this.props.content, null, 4),
            error: {}
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            content: JSON.stringify(nextProps.content, null, 4)
        });
    }
    private onCancel() {
        this.setState({
            editable: false,
            content: JSON.stringify(this.props.content, null, 4)
        });
    }
    private editContent() {
        this.setState({ editable: true });
    }
    private updateContent(event) {
        this.setState({ content: event.target.value });
    }
    private onSave() {
        const { content } = this.state;
        let { error } = this.state;
        let parsedContent = {};

        // reset error
        error = {};
        try {
            parsedContent = helper.parseJson(content);
        } catch (err) {
            error.content = err.message;
        }

        this.setState({ error });
        if (!error.content) {
            this.props.onUpdate(parsedContent);
        }
    }
    private getBorderStyle(): React.CSSProperties {
        const { error } = this.state;

        return error.content ? { borderColor: colors.errorColor } : { borderColor: colors.successColor };
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
        const actions = this.state.editable ?
            [
                <FlatButton
                    key="cancel"
                    label="Cancel"
                    onClick={this.onCancel}
                />,
                <FlatButton
                    key="submit"
                    label="Save"
                    primary={true}
                    onClick={this.onSave}
                />
            ] :
            [
                <FlatButton
                    key="ok"
                    label="OK"
                    primary={true}
                    onClick={this.props.onClose}
                />
            ];

        return (
            <Dialog
                title={this.props.title || ''}
                actions={actions}
                modal={true}
                open={this.props.isOpen}
                autoScrollBodyContent={true}
                repositionOnUpdate={false}
            >
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
                            errorText={this.state.error.content}
                            textareaStyle={style.editableText}
                            style={assign({}, style.editableContainer, this.getBorderStyle())}
                            errorStyle={style.error}
                            onKeyDown={this.handleKeyDown}
                        />
                    </div>}

                </div>
            </Dialog>
        );
    }
}

