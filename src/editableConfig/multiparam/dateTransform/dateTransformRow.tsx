import * as React from 'react';
import * as _ from 'lodash';

import style from './dateTransformStyle';
import { Card, SelectField, MenuItem, TextField, IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';

interface IDateTransformProps {
    targetColumns: any[];
    index: number;
    sourcefieldname?: string;
    sourceformat?: string;
    targetfieldname?: string;
    targetformat?: string;
    onChange: (index: number, params: any) => void;
    onRemove: (index: number) => void;
}

interface IDateTransformState {
    sourceField: string;
    sourceFormat: string;
    targetField: string;
    targetFormat: string;
    errors: any;
}
export default class DateTransformRow extends React.Component<IDateTransformProps, IDateTransformState>{
    constructor(props, context) {
        super(props, context);

        this.chooseSourceField = this.chooseSourceField.bind(this);
        this.chooseTargetField = this.chooseTargetField.bind(this);
        this.setSourceFormat = this.setSourceFormat.bind(this);
        this.setTargetFormat = this.setTargetFormat.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.updateTransform = this.updateTransform.bind(this);

        this.state = {
            sourceField: this.props.sourcefieldname || '',
            targetField: this.props.targetfieldname || '',
            sourceFormat: this.props.sourceformat || '%Y%m%d',
            targetFormat: this.props.targetformat || '%Y-%m-%d',
            errors: {}
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            sourceField: nextProps.sourcefieldname || '',
            targetField: nextProps.targetfieldname || '',
            sourceFormat: nextProps.sourceformat || '%Y%m%d',
            targetFormat: nextProps.targetformat || '%Y-%m-%d'
        });
    }
    private onRemove() {
        this.props.onRemove(this.props.index);
    }
    private updateTransform(targetFIeld, targetFormat, sourceField, sourceFormat) {
        const transformRow = {
            sourcefieldname: sourceField,
            sourceformat: sourceFormat,
            targetformat: targetFormat,
            targetfieldname: targetFIeld
        };

        this.props.onChange(this.props.index, transformRow);
    }
    private chooseTargetField(event, index, targetField) {
        let { sourceField } = this.state;
        sourceField = (sourceField || targetField);
        this.setState({ targetField, sourceField });
        this.updateTransform(
            targetField,
            this.state.targetFormat,
            sourceField,
            this.state.sourceFormat
        );
    }
    private chooseSourceField(event, index, sourceField) {
        let { targetField } = this.state;
        targetField = (targetField || sourceField);
        this.setState({ sourceField, targetField });
        this.updateTransform(
            targetField,
            this.state.targetFormat,
            sourceField,
            this.state.sourceFormat
        );
    }
    private setTargetFormat(event, targetFormat) {
        this.setState({ targetFormat });
        this.updateTransform(
            this.state.targetField,
            targetFormat,
            this.state.sourceField,
            this.state.sourceFormat
        );
    }
    private setSourceFormat(event, sourceFormat) {
        this.setState({ sourceFormat });
        this.updateTransform(
            this.state.targetField,
            this.state.targetFormat,
            this.state.sourceField,
            sourceFormat
        );
    }
    public render(): JSX.Element {
        return (<Card containerStyle={style.configCard}>
            <div style={style.rowContainer}>
                <div>
                    <SelectField
                        floatingLabelText="Target Field"
                        floatingLabelFixed={true}
                        value={this.state.targetField}
                        errorText={this.state.errors.targetField}
                        onChange={this.chooseTargetField}
                    >
                        {_.map(this.props.targetColumns, (column, index) => {
                            return <MenuItem key={index} value={column.name} primaryText={column.name} />;
                        })}
                    </SelectField>
                </div>
                <div>
                    <TextField
                        floatingLabelText="Target Format"
                        floatingLabelFixed={true}
                        value={this.state.targetFormat}
                        errorText={this.state.errors.targetFormat}
                        onChange={this.setTargetFormat}
                    />
                </div>
                <div>
                    <SelectField
                        floatingLabelText="Source Field"
                        floatingLabelFixed={true}
                        value={this.state.sourceField}
                        errorText={this.state.errors.sourceField}
                        onChange={this.chooseSourceField}
                    >
                        {_.map(this.props.targetColumns, (column, index) => {
                            return <MenuItem key={index} value={column.name} primaryText={column.name} />;
                        })}
                    </SelectField>
                </div>
                <div>
                    <TextField
                        floatingLabelText="Source Format"
                        floatingLabelFixed={true}
                        value={this.state.sourceFormat}
                        errorText={this.state.errors.sourceFormat}
                        onChange={this.setSourceFormat}
                    />
                </div>
                <div style={style.buttonContainer}>
                    <IconButton tooltip="Remove" onClick={this.onRemove} style={style.deleteButton} >
                        <ClearIcon />
                    </IconButton>
                </div>
            </div>
        </Card>);
    }
}
