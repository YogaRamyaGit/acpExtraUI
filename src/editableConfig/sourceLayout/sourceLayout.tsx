import * as React from 'react';
import { IConfig } from '../../configs/config';

import { TextField, RaisedButton, Snackbar } from 'material-ui';

import ActionButtons from '../editableConfigActionButtons';
import style from './sourceLayoutStyle';
import * as sourceLayoutActions from './sourceLayoutActions';
import SourceLayoutTable from './sourceLayoutTable';
import * as XLSX from 'xlsx';

interface IEditConfigProps {
    config: IConfig;
    onSave: (any) => void;
}

interface ISourceLayoutState {
    file: any;
    sourceLayout: any[];
    fileName: string;
    showErrorMessage: boolean;
}

export default class SourceLayout extends React.Component<IEditConfigProps, ISourceLayoutState> {
    private fileInput: any;
    constructor(props, context) {
        super(props, context);

        this.readFile = this.readFile.bind(this);
        this.browseFiles = this.browseFiles.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.onSave = this.onSave.bind(this);
        this.handleMessengerClose = this.handleMessengerClose.bind(this);
        this.state = {
            file: {},
            fileName: '',
            sourceLayout: (props.config.sourceLayout.content || []),
            showErrorMessage: false
        };
    }
    public componentWillReceiveProps(nextProps) {
        if (this.state.sourceLayout.length <= 0) {
            this.setState({ sourceLayout: (nextProps.config.sourceLayout.content || []) });
        }
    }
    private readFile(event) {
        const file = event.target.files[0];

        this.setState({
            file,
            fileName: file.name
        });
    }
    private browseFiles() {
        this.fileInput.value = '';
        this.fileInput.click();
    }
    private uploadFile() {
        // process the file. convery excel to JSON
        const { file } = this.state;
        const reader: any = new FileReader();
        reader.onload = (e: { target: { result: any } }) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 0 });
            /* Remove extra spaces and make headers case in-sensitive */
            data.forEach((row, i) => {
                for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                        const value = row[key];
                        const trimmedKey = key.trim().toLowerCase();
                        delete row[key];
                        row[trimmedKey] = value;
                    }
                }
            });
            /* Update state */
            this.setState({ sourceLayout: data });
        };
        reader.readAsBinaryString(file);
    }
    private onSave(event) {
        try {
            sourceLayoutActions.updateSourceLayout(
                this.props.config,
                this.state.sourceLayout
            );

            this.props.onSave(this.props.config);
        } catch (e) {
            this.setState({ showErrorMessage: true });
        }
    }

    private handleMessengerClose() {
        this.setState({ showErrorMessage: false });
    }
    public render(): JSX.Element {
        return (<div>
            <div style={style.topContent}>
                <div style={style.formContent}>
                    <input
                        style={style.fileField}
                        type="file"
                        ref={(input) => { this.fileInput = input; }}
                        onChange={this.readFile}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                    <TextField
                        hintText="Source Layout file"
                        value={this.state.fileName}
                    />
                    <div>
                        <RaisedButton label="Browse" style={style.button} onClick={this.browseFiles} />
                        <RaisedButton label="Upload" primary={true} style={style.button} onClick={this.uploadFile} />
                    </div>
                </div>
                <div>
                    {this.state.sourceLayout.length > 0 && <RaisedButton label="Generate De-id file" primary={true} />}
                </div>
            </div>
            <div>
                {this.state.sourceLayout.length > 0 && <SourceLayoutTable sourceLayout={this.state.sourceLayout} />}
            </div>
            {this.state.sourceLayout.length > 0 &&
                <ActionButtons
                    onSave={this.onSave}
                />}

            <Snackbar
                open={this.state.showErrorMessage}
                message="File not valid"
                autoHideDuration={2000}
                onRequestClose={this.handleMessengerClose}
            />
        </div>);
    }
}
